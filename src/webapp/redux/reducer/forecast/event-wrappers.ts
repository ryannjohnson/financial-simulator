import { CalendarDate } from '../../../../calendar-date';
import * as timeline from '../../../../timeline';
import { generateLocalUUID } from '../../../../utils';
import * as types from '../../types';
import * as actions from '../../actions';
import { setTrack } from './timeline';
import { EventWrapper, State, Track } from './props';

const TRACK_DEFAULT_NAME = 'Untitled';

export function addEvent(state: State, action: types.forecast.AddEvent): State {
  const eventWrapper: EventWrapper = {
    event: action.event,
    id: generateLocalUUID(),
  };

  const event = timeline.Event.fromJSON(action.event);

  state = addEventToEarliestTrack(state, eventWrapper.id, event);
  state = selectEvent(state, actions.forecast.selectEvent(eventWrapper.id));

  return { ...state, eventWrappers: [...state.eventWrappers, eventWrapper] };
}

export function exportEvents(
  state: State,
  _: types.forecast.ExportEvents,
): State {
  const eventsJSON = state.eventWrappers.map(a => a.event);
  const blob = new Blob([JSON.stringify(eventsJSON, null, 2)], {
    type: 'application/json',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  const date = new Date().toISOString();
  a.download = `${date.split('T')[0]}_ForecastEvents.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);

  return state;
}

export function importEvents(
  state: State,
  action: types.forecast.ImportEvents,
): State {
  for (const eventJSON of action.events) {
    const event = timeline.Event.fromJSON(eventJSON);
    state = addEvent(state, actions.forecast.addEvent(event));
  }

  return state;
}

export function removeEvent(
  state: State,
  action: types.forecast.RemoveEvent,
): State {
  state = removeEventFromTracks(state, action.id);
  state = selectEvent(state, actions.forecast.selectEvent(null));

  return {
    ...state,
    eventWrappers: state.eventWrappers.filter(({ id }) => id !== action.id),
  };
}

export function selectEvent(
  state: State,
  action: types.forecast.SelectEvent,
): State {
  return {
    ...state,
    selectedEventId: action.id,
  };
}

export function setEvent(state: State, action: types.forecast.SetEvent): State {
  const event = timeline.Event.fromJSON(action.event);

  let hasBeenMovedToAnotherTrack = false;
  const trackIndex = state.timeline.tracks.findIndex(t =>
    t.eventIds.includes(action.id),
  );
  if (trackIndex === -1) {
    throw new Error(`Event id "${action.id}" doesn't belong to any tracks`);
  }
  const track = state.timeline.tracks[trackIndex];
  const trackEventIds = new Set(track.eventIds);

  let eventWrappers: EventWrapper[] = [];

  for (const eventWrapper of state.eventWrappers) {
    if (eventWrapper.id === action.id) {
      const newEventWrapper = { id: action.id, event: action.event };
      eventWrappers = [...eventWrappers, newEventWrapper];
      continue;
    }

    if (!hasBeenMovedToAnotherTrack && trackEventIds.has(eventWrapper.id)) {
      const existingEvent = timeline.Event.fromJSON(eventWrapper.event);
      if (areOverlapping(event, existingEvent)) {
        // There are many ways to set an event, so let this be flexible.
        state = removeEventFromTracks(state, action.id);
        state = addEventToEarliestTrack(
          state,
          action.id,
          event,
          trackIndex + 1,
        );
        hasBeenMovedToAnotherTrack = true;
      }
    }

    eventWrappers = [...eventWrappers, eventWrapper];
  }

  return { ...state, eventWrappers };
}

export function setEventCalendarDates(
  state: State,
  action: types.forecast.SetEventCalendarDates,
): State {
  const { event: eventJSON, id } = getEventWrapperById(state, action.eventId);
  const event = timeline.Event.fromJSON(eventJSON);
  const startsOn = CalendarDate.fromJSON(action.startsOn);
  const endsOn = action.endsOn ? CalendarDate.fromJSON(action.endsOn) : null;
  event.setDateRange(startsOn, endsOn);

  const track = state.timeline.tracks.find(a => a.eventIds.includes(id));
  if (!track) {
    throw new Error(
      `Event id "${action.eventId}" doesn't belong to any tracks`,
    );
  }

  for (const eventId of track.eventIds) {
    if (eventId === action.eventId) {
      continue;
    }

    const trackEventWrapper = getEventWrapperById(state, eventId);
    const trackEvent = timeline.Event.fromJSON(trackEventWrapper.event);
    if (areOverlapping(event, trackEvent)) {
      // TODO: Figure out what the closest is that these dates can be moved
      return state;
    }
  }

  let eventWrappers: EventWrapper[] = [];

  for (const eventWrapper of state.eventWrappers) {
    if (eventWrapper.id !== id) {
      eventWrappers = [...eventWrappers, eventWrapper];
      continue;
    }
    eventWrappers = [...eventWrappers, { event: event.toJSON(), id }];
  }

  return {
    ...state,
    eventWrappers,
  };
}

export function setEventStartsOn(
  state: State,
  action: types.forecast.SetEventStartsOn,
): State {
  const { event: eventJSON, id } = getEventWrapperById(state, action.eventId);
  const event = timeline.Event.fromJSON(eventJSON);
  const startsOn = CalendarDate.fromJSON(action.startsOn);

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setEventCalendarDates(
    state,
    actions.forecast.setEventCalendarDates(id, startsOn, event.getEndsOn()),
  );
}

export function setEventEndsOn(
  state: State,
  action: types.forecast.SetEventEndsOn,
): State {
  const { event: eventJSON, id } = getEventWrapperById(state, action.eventId);
  const event = timeline.Event.fromJSON(eventJSON);
  const endsOn = action.endsOn ? CalendarDate.fromJSON(action.endsOn) : null;

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setEventCalendarDates(
    state,
    actions.forecast.setEventCalendarDates(id, event.getStartsOn(), endsOn),
  );
}

function getEventWrapperById(state: State, id: string): EventWrapper {
  const eventWrapper = state.eventWrappers.find(a => a.id === id);
  if (!eventWrapper) {
    throw new Error(`Event could not be found by id "${id}"`);
  }
  return eventWrapper;
}

function addEventToEarliestTrack(
  state: State,
  eventId: string,
  event: timeline.Event,
  earliestIndex = 0,
): State {
  for (let i = earliestIndex; i < state.timeline.tracks.length; i++) {
    const track = state.timeline.tracks[i];
    let foundOverlap = false;

    for (const trackEventId of track.eventIds) {
      const trackEventWrapper = getEventWrapperById(state, trackEventId);
      const trackEvent = timeline.Event.fromJSON(trackEventWrapper.event);
      foundOverlap = areOverlapping(event, trackEvent);
      if (foundOverlap) {
        break;
      }
    }

    if (!foundOverlap) {
      const action = actions.forecast.setTrack(track.id, {
        ...track,
        eventIds: [...track.eventIds, eventId],
      });
      return setTrack(state, action);
    }
  }

  const track: Track = {
    eventIds: [eventId],
    id: generateLocalUUID(),
    name: TRACK_DEFAULT_NAME,
  };

  return {
    ...state,
    timeline: {
      ...state.timeline,
      tracks: [...state.timeline.tracks, track],
    },
  };
}

function removeEventFromTracks(state: State, eventId: string): State {
  return {
    ...state,
    timeline: {
      ...state.timeline,
      tracks: state.timeline.tracks.map(track => {
        if (!track.eventIds.includes(eventId)) {
          return track;
        }

        return {
          ...track,
          eventIds: track.eventIds.filter(a => a !== eventId),
        };
      }),
    },
  };
}

function areOverlapping(a: timeline.Event, b: timeline.Event): boolean {
  const [a0, a1] = a.getDateRange();
  const [b0, b1] = b.getDateRange();

  if (!a1) {
    if (!b1) {
      return true;
    }

    if (b1.daysAfter(a0) > -1) {
      return true;
    }

    return false;
  }

  if (!b1) {
    if (a1.daysAfter(b0) > -1) {
      return true;
    }

    return false;
  }

  if (a0.daysBefore(b1) > -1 && a1.daysAfter(b0) > -1) {
    return true;
  }

  return false;
}

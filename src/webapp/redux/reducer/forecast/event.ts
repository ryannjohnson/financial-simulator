import { CalendarDate, rangesOverlap } from '../../../../calendar-date';
import { Event } from '../../../../timeline';
import * as types from '../../types';
import * as actions from '../../actions';
import { selectTrackItem } from './account';
import { State, TrackItem, TrackItemType } from './props';
import * as utils from './utils';

export function addEvent(state: State, action: types.forecast.AddEvent): State {
  const event = Event.fromJSON(action.event);

  state = { ...state, events: { ...state.events, [event.id]: event.toJSON() } };

  const trackItem: TrackItem = {
    id: event.id,
    type: TrackItemType.Event,
  };

  for (const accountId of [event.fromAccountId, event.toAccountId]) {
    if (accountId) {
      state = utils.addTrackItemToEarliestTrack(state, trackItem, accountId);
    }
  }

  state = selectTrackItem(state, actions.forecast.selectTrackItem(trackItem));

  return state;
}

export function setEvent(state: State, action: types.forecast.SetEvent): State {
  const existingEvent = Event.fromJSON(state.events[action.event.id]);
  const event = Event.fromJSON(action.event);

  state = { ...state, events: { ...state.events, [event.id]: event.toJSON() } };

  const trackItem: TrackItem = {
    id: action.event.id,
    type: TrackItemType.Event,
  };

  const existingAccountIds = existingEvent.belongsToAccountIds();
  const newAccountIds = event.belongsToAccountIds();

  for (const accountId of newAccountIds) {
    if (existingAccountIds.includes(accountId)) {
      state = utils.autoMoveItemToEarliestTrack(state, trackItem, accountId);
    } else {
      state = utils.addTrackItemToEarliestTrack(state, trackItem, accountId);
    }
  }

  for (const accountId of existingAccountIds) {
    if (!newAccountIds.includes(accountId)) {
      state = utils.removeTrackItemFromTracks(state, trackItem, accountId);
    }
  }

  return state;
}

export function setEventAccountIds(
  state: State,
  action: types.forecast.SetEventAccountIds,
): State {
  const event = Event.fromJSON({
    ...state.events[action.eventId],
    fromAccountId: action.fromAccountId,
    toAccountId: action.toAccountId,
  });

  return setEvent(state, actions.forecast.setEvent(event));
}

/**
 * Should only be called if the type is Event.
 */
export function setEventCalendarDates(
  state: State,
  action: types.forecast.SetTrackItemCalendarDates,
): State {
  const event = Event.fromJSON({
    ...state.events[action.trackItem.id],
    endsOn: action.endsOn,
    startsOn: action.startsOn || state.timeline.startsOn,
  });

  const accountWrapper = utils.getAccountWrapper(state, action.accountId);
  const maxTrackIndex = accountWrapper.tracks.length - 1;
  const trackIndex = Math.min(Math.max(action.trackIndex, 0), maxTrackIndex);
  const track = accountWrapper.tracks[trackIndex];

  let isAlreadyOnTrack = false;

  for (const trackItem of track.items) {
    if (utils.trackItemEquals(trackItem, action.trackItem)) {
      isAlreadyOnTrack = true;
      continue;
    }

    const trackItemDetails = utils.trackItemToDateRange(state, trackItem);

    const areOverlapping = rangesOverlap(
      event.startsOn,
      event.endsOn,
      trackItemDetails.startsOn,
      trackItemDetails.endsOn,
    );

    if (areOverlapping) {
      // TODO: Figure out what the closest is that these dates can be moved
      return state;
    }
  }

  if (!isAlreadyOnTrack) {
    state = utils.moveTrackItemToTrackIndex(
      state,
      action.trackItem,
      action.accountId,
      trackIndex,
    );
  }

  for (const accountId of event.belongsToAccountIds()) {
    if (accountId !== action.accountId) {
      state = utils.autoMoveItemToEarliestTrack(
        state,
        action.trackItem,
        accountId,
      );
    }
  }

  return { ...state, events: { ...state.events, [event.id]: event.toJSON() } };
}

export function setEventStartsOn(
  state: State,
  action: types.forecast.SetTrackItemStartsOn,
): State {
  const event = Event.fromJSON(state.events[action.trackItem.id]);
  const startsOn = CalendarDate.fromJSON(
    // Events always need a start date.
    action.startsOn || state.timeline.startsOn,
  );
  const trackItem: TrackItem = { id: event.id, type: TrackItemType.Event };

  const accountWrapper = utils.getAccountWrapper(state, action.accountId);
  const trackIndex = accountWrapper.tracks.findIndex(t =>
    utils.trackHasItem(t, trackItem),
  );

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setEventCalendarDates(
    state,
    actions.forecast.setTrackItemCalendarDates(
      action.accountId,
      trackItem,
      trackIndex,
      startsOn,
      event.endsOn,
    ),
  );
}

export function setEventEndsOn(
  state: State,
  action: types.forecast.SetTrackItemEndsOn,
): State {
  const event = Event.fromJSON(state.events[action.trackItem.id]);
  const endsOn = utils.toCalendarDateOrNull(action.endsOn);
  const trackItem: TrackItem = { id: event.id, type: TrackItemType.Event };

  const accountWrapper = utils.getAccountWrapper(state, action.accountId);
  const trackIndex = accountWrapper.tracks.findIndex(t =>
    utils.trackHasItem(t, trackItem),
  );

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setEventCalendarDates(
    state,
    actions.forecast.setTrackItemCalendarDates(
      action.accountId,
      trackItem,
      trackIndex,
      event.startsOn,
      endsOn,
    ),
  );
}

export function removeEvent(
  state: State,
  action: types.forecast.RemoveEvent,
): State {
  const trackItem: TrackItem = {
    id: action.id,
    type: TrackItemType.Event,
  };

  state = utils.removeTrackItemFromTracks(state, trackItem, null);
  state = selectTrackItem(state, actions.forecast.selectTrackItem(null));

  const events = { ...state.events };
  delete events[action.id];

  return {
    ...state,
    events,
  };
}

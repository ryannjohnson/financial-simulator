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

  if (event.fromAccountId) {
    state = utils.addTrackItemToEarliestTrack(
      state,
      event.fromAccountId,
      trackItem,
    );
  }

  if (event.toAccountId) {
    state = utils.addTrackItemToEarliestTrack(
      state,
      event.toAccountId,
      trackItem,
    );
  }

  state = selectTrackItem(state, actions.forecast.selectTrackItem(trackItem));

  return state;
}

export function setEvent(state: State, action: types.forecast.SetEvent): State {
  const event = Event.fromJSON(action.event);
  const trackItem: TrackItem = {
    id: action.event.id,
    type: TrackItemType.Event,
  };

  let checkedAccountIds: string[] = [];

  for (const accountId of [event.fromAccountId, event.toAccountId]) {
    if (!accountId) {
      continue;
    }

    checkedAccountIds = [...checkedAccountIds, accountId];

    state = utils.autoMoveItemToEarliestTrack(state, trackItem, accountId);
  }

  const uncheckedAccountIds = state.accountWrappers
    .map(a => a.account.id)
    .filter(id => !checkedAccountIds.includes(id));

  for (const accountId of uncheckedAccountIds) {
    state = utils.removeTrackItemFromTracks(state, trackItem, accountId);
  }

  return { ...state, events: { ...state.events, [event.id]: event.toJSON() } };
}

/**
 * Should only be called if the type is Event.
 */
export function setEventCalendarDates(
  state: State,
  action: types.forecast.SetTrackItemCalendarDates,
): State {
  const event = Event.fromJSON(state.events[action.trackItem.id]);
  const startsOn = CalendarDate.fromJSON(
    // Events always need a start date.
    action.startsOn || state.timeline.startsOn,
  );
  const endsOn = utils.toCalendarDateOrNull(action.endsOn);
  event.setDateRange(startsOn, endsOn);

  const accountWrapper = utils.getAccountWrapper(state, action.accountId);

  const maxTrackIndex = accountWrapper.tracks.length - 1;
  const trackIndex = Math.min(Math.max(action.trackIndex, 0), maxTrackIndex);
  const track = accountWrapper.tracks[trackIndex];

  let isAlreadyOnTrack = false;
  for (const trackItem of track.items) {
    if (utils.trackItemsMatch(trackItem, action.trackItem)) {
      isAlreadyOnTrack = true;
      continue;
    }

    const trackItemDetails = utils.trackItemToDateRange(state, trackItem);

    const areOverlapping = rangesOverlap(
      startsOn,
      endsOn,
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
      action.accountId,
      action.trackItem,
      trackIndex,
    );
  }

  for (const accountId of [event.toAccountId, event.fromAccountId]) {
    if (!accountId || accountId === action.accountId) {
      continue;
    }

    state = utils.autoMoveItemToEarliestTrack(
      state,
      action.trackItem,
      accountId,
    );
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

import { CalendarDate } from '../../../../calendar-date';
import { Event } from '../../../../timeline';
import { TrackItem, TrackItemType } from '../../../track-item';
import * as types from '../../types';
import * as actions from '../../actions';
import { selectTrackItem } from './account';
import { State } from './props';
import * as utils from './utils';

export function add(state: State, action: types.forecast.AddEvent): State {
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

export function remove(
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

export function set(state: State, action: types.forecast.SetEvent): State {
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
      state = utils.moveTrackItemToEarliestTrack(state, trackItem, accountId);
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

export function setAccountIds(
  state: State,
  action: types.forecast.SetEventAccountIds,
): State {
  const event = Event.fromJSON({
    ...state.events[action.eventId],
    fromAccountId: action.fromAccountId,
    toAccountId: action.toAccountId,
  });

  return set(state, actions.forecast.setEvent(event));
}

/**
 * Should only be called if the type is Event.
 */
export function setCalendarDates(
  state: State,
  action: types.forecast.SetTrackItemCalendarDates,
): State {
  const event = Event.fromJSON({
    ...state.events[action.trackItem.id],
    endsOn: action.endsOn,
    startsOn: action.startsOn || state.timeline.startsOn,
  });

  const otherAccountIds = event
    .belongsToAccountIds()
    .filter(a => a !== action.accountId);

  let ok: boolean;

  ({ ok, state } = utils.setTrackItemCalendarDates(
    state,
    action,
    event.startsOn,
    event.endsOn,
    otherAccountIds,
  ));

  if (!ok) {
    return state;
  }

  return { ...state, events: { ...state.events, [event.id]: event.toJSON() } };
}

export function setEndsOn(
  state: State,
  action: types.forecast.SetTrackItemEndsOn,
): State {
  const event = Event.fromJSON(state.events[action.trackItem.id]);
  const endsOn = utils.toCalendarDateOrNull(action.endsOn);

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setCalendarDates(
    state,
    utils.toSetTrackItemCalendarDatesAction(
      state,
      action,
      event.startsOn,
      endsOn,
    ),
  );
}

export function setStartsOn(
  state: State,
  action: types.forecast.SetTrackItemStartsOn,
): State {
  const event = Event.fromJSON(state.events[action.trackItem.id]);
  const startsOn = CalendarDate.fromJSON(
    // Events always need a start date.
    action.startsOn || state.timeline.startsOn,
  );

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setCalendarDates(
    state,
    utils.toSetTrackItemCalendarDatesAction(
      state,
      action,
      startsOn,
      event.endsOn,
    ),
  );
}

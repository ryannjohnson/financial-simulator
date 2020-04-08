import { CalendarDate, CalendarDateJSON } from '../../../../../calendar-date';
import { Effect, Event } from '../../../../../timeline';
import { TrackItem, TrackItemType } from '../../../../track-item';
import * as actions from '../../../actions';
import * as types from '../../../types';
import { State, Track } from '../props';

export function getAccountWrapper(state: State, accountId: string) {
  const accountWrapper = state.accountWrappers.find(
    a => a.account.id === accountId,
  );

  if (!accountWrapper) {
    throw new Error(`Account by id "${accountId}" does not exist`);
  }

  return accountWrapper;
}

export function toCalendarDateOrNull(
  value: CalendarDateJSON | null,
): CalendarDate | null {
  if (!value) {
    return null;
  }

  return CalendarDate.fromJSON(value);
}

export function toSetTrackItemCalendarDatesAction(
  state: State,
  action:
    | types.forecast.SetTrackItemEndsOn
    | types.forecast.SetTrackItemStartsOn,
  startsOn: CalendarDate | null,
  endsOn: CalendarDate | null,
) {
  const accountWrapper = getAccountWrapper(state, action.accountId);
  const trackIndex = accountWrapper.tracks.findIndex(t =>
    trackHasItem(t, action.trackItem),
  );

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return actions.forecast.setTrackItemCalendarDates(
    action.accountId,
    action.trackItem,
    trackIndex,
    startsOn,
    endsOn,
  );
}

export function trackHasItem(track: Track, item: TrackItem): boolean {
  return track.items.find(i => trackItemEquals(i, item)) !== undefined;
}

export function trackItemEquals(a: TrackItem, b: TrackItem): boolean {
  return a.id === b.id && a.type === b.type;
}

interface DateRange {
  endsOn: CalendarDate | null;
  startsOn: CalendarDate | null;
}

export function trackItemToDateRange(
  state: State,
  trackItem: TrackItem,
): DateRange {
  if (trackItem.type === TrackItemType.Effect) {
    return Effect.fromJSON(state.effects[trackItem.id]);
  }

  if (trackItem.type === TrackItemType.Event) {
    return Event.fromJSON(state.events[trackItem.id]);
  }

  throw new Error(`TrackItemType "${trackItem.type}" has not been implemented`);
}

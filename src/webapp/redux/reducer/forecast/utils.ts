import {
  CalendarDate,
  CalendarDateJSON,
  rangesOverlap,
} from '../../../../calendar-date';
import { Effect, Event } from '../../../../timeline';
import { generateLocalUUID } from '../../../../utils';
import * as actions from '../../actions';
import { addTrack, setTrack } from './account';
import {
  AccountWrapper,
  State,
  Track,
  TrackItem,
  TrackItemType,
} from './props';

const TRACK_DEFAULT_NAME = 'Untitled';

export function addTrackItemToEarliestTrack(
  state: State,
  trackItem: TrackItem,
  accountId: string,
  earliestIndex = 0,
): State {
  const accountWrapper = getAccountWrapper(state, accountId);
  const dateRange = trackItemToDateRange(state, trackItem);

  for (let i = earliestIndex; i < accountWrapper.tracks.length; i++) {
    const track = accountWrapper.tracks[i];
    let foundOverlap = false;

    for (const existingTrackItem of track.items) {
      const existingDateRange = trackItemToDateRange(state, existingTrackItem);

      foundOverlap = rangesOverlap(
        dateRange.startsOn,
        dateRange.endsOn,
        existingDateRange.startsOn,
        existingDateRange.endsOn,
      );

      if (foundOverlap) {
        break;
      }
    }

    if (!foundOverlap) {
      const updatedTrack: Track = {
        ...track,
        items: [...track.items, trackItem],
      };
      return setTrack(state, actions.forecast.setTrack(updatedTrack));
    }
  }

  const newTrack: Track = {
    id: generateLocalUUID(),
    items: [trackItem],
    name: TRACK_DEFAULT_NAME,
  };

  return addTrack(state, actions.forecast.addTrack(accountId, newTrack));
}

export function removeTrackItemFromTracks(
  state: State,
  trackItem: TrackItem,
  accountId: string | null,
): State {
  let accountWrappers: AccountWrapper[] = [];
  for (const accountWrapper of state.accountWrappers) {
    if (accountId && accountId !== accountWrapper.account.id) {
      accountWrappers = [...accountWrappers, accountWrapper];
      continue;
    }

    let tracks: Track[] = [];

    for (let track of accountWrapper.tracks) {
      const index = track.items.findIndex(a => trackItemEquals(a, trackItem));

      if (index !== -1) {
        track = {
          ...track,
          items: [
            ...track.items.slice(0, index),
            ...track.items.slice(index + 1),
          ],
        };
      }

      tracks = [...tracks, track];
    }

    accountWrappers = [...accountWrappers, { ...accountWrapper, tracks }];
  }

  return {
    ...state,
    accountWrappers,
  };
}

export function getAccountWrapper(state: State, accountId: string) {
  const accountWrapper = state.accountWrappers.find(
    a => a.account.id === accountId,
  );

  if (!accountWrapper) {
    throw new Error(`Account by id "${accountId}" does not exist`);
  }

  return accountWrapper;
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

export function toCalendarDateOrNull(
  value: CalendarDateJSON | null,
): CalendarDate | null {
  if (!value) {
    return null;
  }

  return CalendarDate.fromJSON(value);
}

export function moveTrackItemToTrackIndex(
  state: State,
  trackItem: TrackItem,
  accountId: string,
  trackIndex: number,
): State {
  state = removeTrackItemFromTracks(state, trackItem, accountId);

  let accountWrappers: AccountWrapper[] = [];

  for (const accountWrapper of state.accountWrappers) {
    if (accountWrapper.account.id !== accountId) {
      accountWrappers = [...accountWrappers, accountWrapper];
      continue;
    }

    const newAccountWrapper: AccountWrapper = {
      ...accountWrapper,
      tracks: accountWrapper.tracks.map((track, i) => {
        if (i !== trackIndex) {
          return track;
        }

        return {
          ...track,
          items: [...track.items, trackItem],
        };
      }),
    };

    accountWrappers = [...accountWrappers, newAccountWrapper];
  }

  return { ...state, accountWrappers };
}

export function autoMoveItemToEarliestTrack(
  state: State,
  trackItem: TrackItem,
  accountId: string,
): State {
  const accountWrapper = getAccountWrapper(state, accountId);
  const trackItemDateRange = trackItemToDateRange(state, trackItem);

  const trackIndex = accountWrapper.tracks.findIndex(track =>
    trackHasItem(track, trackItem),
  );

  if (trackIndex === -1) {
    throw new Error(
      `TrackItem "${trackItem.type} ${trackItem.id}" doesn't belong to any tracks on account "${accountId}"`,
    );
  }

  for (const existingTrackItem of accountWrapper.tracks[trackIndex].items) {
    if (trackItemEquals(existingTrackItem, trackItem)) {
      continue;
    }

    const { endsOn, startsOn } = trackItemToDateRange(state, existingTrackItem);

    const areOverlapping = rangesOverlap(
      trackItemDateRange.startsOn,
      trackItemDateRange.endsOn,
      startsOn,
      endsOn,
    );

    if (areOverlapping) {
      state = removeTrackItemFromTracks(state, trackItem, accountId);
      state = addTrackItemToEarliestTrack(
        state,
        trackItem,
        accountId,
        trackIndex + 1,
      );
      break;
    }
  }

  return state;
}

import { CalendarDate, rangesOverlap } from '../../../../../calendar-date';
import { TrackItem } from '../../../../track-item';
import * as types from '../../../types';
import { AccountWrapper, State } from '../props';
import {
  getAccountWrapper,
  trackHasItem,
  trackItemEquals,
  trackItemToDateRange,
} from './common';
import { moveTrackItemToEarliestTrack } from './move-track-item-to-earliest-track';
import { moveTrackItemToTrackIndex } from './move-track-item-to-track-index';

type Result = {
  ok: boolean;
  state: State;
};

export function setTrackItemCalendarDates(
  state: State,
  action: types.forecast.SetTrackItemCalendarDates,
  startsOn: CalendarDate | null,
  endsOn: CalendarDate | null,
  otherAccountIds: string[],
): Result {
  const accountWrapper = getAccountWrapper(state, action.accountId);
  const maxTrackIndex = accountWrapper.tracks.length - 1;
  const trackIndex = Math.min(Math.max(action.trackIndex, 0), maxTrackIndex);
  const track = accountWrapper.tracks[trackIndex];

  let isAlreadyOnTrack = false;

  for (const trackItem of track.items) {
    if (trackItemEquals(trackItem, action.trackItem)) {
      isAlreadyOnTrack = true;
      continue;
    }

    if (trackItemOverlaps(state, trackItem, startsOn, endsOn)) {
      const originalTrackIndex = getTrackIndex(
        accountWrapper,
        action.trackItem,
      );

      if (trackIndex === originalTrackIndex) {
        // TODO: Figure out what the closest is that these dates can be moved
        return { ok: false, state };
      }

      // Try to still move along original track.
      isAlreadyOnTrack = true;

      const originalTrack = accountWrapper.tracks[originalTrackIndex];
      for (const originalTrackItem of originalTrack.items) {
        if (trackItemEquals(originalTrackItem, action.trackItem)) {
          continue;
        }

        if (trackItemOverlaps(state, originalTrackItem, startsOn, endsOn)) {
          // TODO: Figure out what the closest is that these dates can be moved
          return { ok: false, state };
        }
      }

      // Continue!
    }
  }

  if (!isAlreadyOnTrack) {
    state = moveTrackItemToTrackIndex(
      state,
      action.trackItem,
      action.accountId,
      trackIndex,
    );
  }

  for (const accountId of otherAccountIds) {
    if (accountId !== action.accountId) {
      state = moveTrackItemToEarliestTrack(state, action.trackItem, accountId);
    }
  }

  return { ok: true, state };
}

function trackItemOverlaps(
  state: State,
  trackItem: TrackItem,
  startsOn: CalendarDate | null,
  endsOn: CalendarDate | null,
): boolean {
  const trackItemDetails = trackItemToDateRange(state, trackItem);

  return rangesOverlap(
    startsOn,
    endsOn,
    trackItemDetails.startsOn,
    trackItemDetails.endsOn,
  );
}

function getTrackIndex(
  accountWrapper: AccountWrapper,
  trackItem: TrackItem,
): number {
  const index = accountWrapper.tracks.findIndex(t =>
    trackHasItem(t, trackItem),
  );

  if (index === -1) {
    throw new Error(
      `TrackItem "${trackItem.type} ${trackItem.id}" doesn't exist on account "${accountWrapper.account.id}"`,
    );
  }

  return index;
}

import { rangesOverlap } from '../../../../../calendar-date';
import { State, TrackItem } from '../props';
import { addTrackItemToEarliestTrack } from './add-track-item-to-earliest-track';
import {
  getAccountWrapper,
  trackHasItem,
  trackItemEquals,
  trackItemToDateRange,
} from './common';
import { removeTrackItemFromTracks } from './remove-track-item-from-tracks';

export function moveTrackItemToEarliestTrack(
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

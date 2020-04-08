import { rangesOverlap } from '../../../../../calendar-date';
import { generateLocalUUID } from '../../../../../utils';
import { TrackItem } from '../../../../track-item';
import * as actions from '../../../actions';
import { addTrack, setTrack } from '../account';
import { getAccountWrapper, trackItemToDateRange } from './common';
import { State, Track } from '../props';

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

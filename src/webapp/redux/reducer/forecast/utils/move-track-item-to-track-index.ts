import { AccountWrapper, State, TrackItem } from '../props';
import { removeTrackItemFromTracks } from './remove-track-item-from-tracks';

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

import { TrackItem } from '../../../../track-item';
import { AccountWrapper, State, Track } from '../props';
import { trackItemEquals } from './common';

export function removeTrackItemFromTracks(
  state: State,
  trackItem: TrackItem,
  accountId: string | null,
): State {
  let accountWrappers: AccountWrapper[] = [];
  for (const accountWrapper of state.accountWrappers) {
    if (accountId !== null && accountId !== accountWrapper.account.id) {
      accountWrappers = [...accountWrappers, accountWrapper];
      continue;
    }

    let tracks: Track[] = [];

    for (let track of accountWrapper.tracks) {
      if (track.items.find(a => trackItemEquals(a, trackItem))) {
        track = {
          ...track,
          items: track.items.filter(a => !trackItemEquals(a, trackItem)),
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

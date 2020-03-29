import * as types from '../../types';
import { AccountWrapper, State } from './props';

export function add(state: State, action: types.forecast.AddAccount): State {
  const accountWrapper: AccountWrapper = {
    account: action.account,
    tracks: [],
  };

  return {
    ...state,
    accountWrappers: [...state.accountWrappers, accountWrapper],
    selectedTrackItem: null,
    timeline: {
      ...state.timeline,
      accountId: action.account.id,
    },
  };
}

export function addTrack(state: State, action: types.forecast.AddTrack): State {
  const accountWrapperIndex = state.accountWrappers.findIndex(
    a => a.account.id === action.accountId,
  );
  if (accountWrapperIndex === -1) {
    throw new Error(`Account with id "${action.accountId}" does not exist`);
  }

  const accountWrapper = state.accountWrappers[accountWrapperIndex];

  const newAccountWrapper: AccountWrapper = {
    ...accountWrapper,
    tracks: [...accountWrapper.tracks, action.track],
  };

  return {
    ...state,
    accountWrappers: [
      ...state.accountWrappers.slice(0, accountWrapperIndex),
      newAccountWrapper,
      ...state.accountWrappers.slice(accountWrapperIndex + 1),
    ],
  };
}

export function setTrack(state: State, action: types.forecast.SetTrack): State {
  let accountWrappers: AccountWrapper[] = [];

  for (let accountWrapper of state.accountWrappers) {
    let trackIndex = accountWrapper.tracks.findIndex(
      a => a.id === action.track.id,
    );

    if (trackIndex !== -1) {
      accountWrapper = {
        ...accountWrapper,
        tracks: [
          ...accountWrapper.tracks.slice(0, trackIndex),
          action.track,
          ...accountWrapper.tracks.slice(trackIndex + 1),
        ],
      };
    }

    accountWrappers = [...accountWrappers, accountWrapper];
  }

  return {
    ...state,
    accountWrappers,
  };
}

export function select(
  state: State,
  action: types.forecast.SelectAccount,
): State {
  if (state.timeline.accountId === action.accountId) {
    return state;
  }

  return {
    ...state,
    selectedTrackItem: null,
    timeline: {
      ...state.timeline,
      accountId: action.accountId,
    },
  };
}

export function selectTrackItem(
  state: State,
  action: types.forecast.SelectTrackItem,
): State {
  return {
    ...state,
    selectedTrackItem: action.trackItem,
  };
}

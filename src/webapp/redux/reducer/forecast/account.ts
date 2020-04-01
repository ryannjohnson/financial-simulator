import { EventJSON } from '../../../../timeline';
import { generateLocalUUID } from '../../../../utils';
import { newAccount } from '../../../defaults';
import * as actions from '../../actions';
import * as types from '../../types';
import { AccountWrapper, State } from './props';

export function add(state: State, action: types.forecast.AddAccount): State {
  const accountWrapper: AccountWrapper = {
    account: action.account,
    tracks: [
      { id: generateLocalUUID(), items: [], name: '' },
      { id: generateLocalUUID(), items: [], name: '' },
      { id: generateLocalUUID(), items: [], name: '' },
    ],
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

export function remove(
  state: State,
  action: types.forecast.RemoveAccount,
): State {
  const accountWrapperIndex = state.accountWrappers.findIndex(
    a => a.account.id === action.accountId,
  );

  if (accountWrapperIndex === -1) {
    throw new Error(`Account with id "${action.accountId}" does not exist`);
  }

  const { account: accountJSON } = state.accountWrappers[accountWrapperIndex];

  state = {
    ...state,
    accountWrappers: state.accountWrappers.filter(
      a => a.account.id !== action.accountId,
    ),
  };

  const eventIdsToDelete = new Set<string>();

  for (const [eventId, eventJSON] of Object.entries(state.events)) {
    if (eventJSON.fromAccountId === accountJSON.id) {
      if (eventJSON.toAccountId === null) {
        // Event with no accounts is lost.
        eventIdsToDelete.add(eventId);
        continue;
      }
      state = updateEvent(state, { ...eventJSON, fromAccountId: null });
      continue;
    }

    if (eventJSON.toAccountId === accountJSON.id) {
      if (eventJSON.fromAccountId === null) {
        // Event with no accounts is lost.
        eventIdsToDelete.add(eventId);
        continue;
      }
      state = updateEvent(state, { ...eventJSON, toAccountId: null });
      continue;
    }
  }

  for (const eventId of eventIdsToDelete.values()) {
    const events = { ...state.events };
    delete events[eventId];
    state = { ...state, events };
  }

  const effectIdsToDelete = new Set<string>();

  for (const effectId of accountJSON.effectIds) {
    let existsOnAnotherAccount = false;
    for (const { account } of state.accountWrappers) {
      if (account.effectIds.includes(effectId)) {
        existsOnAnotherAccount = true;
        break;
      }
    }
    if (!existsOnAnotherAccount) {
      effectIdsToDelete.add(effectId);
    }
  }

  for (const effectId of effectIdsToDelete.values()) {
    const effects = { ...state.effects };
    delete effects[effectId];
    state = { ...state, effects };
  }

  if (state.accountWrappers.length === 0) {
    state = add(state, actions.forecast.addAccount(newAccount()));
  }

  const index = Math.min(accountWrapperIndex, state.accountWrappers.length - 1);
  const selectedAccountId = state.accountWrappers[index].account.id;
  state = select(state, actions.forecast.selectAccount(selectedAccountId));

  return state;
}

function updateEvent(state: State, eventJSON: EventJSON): State {
  return {
    ...state,
    events: {
      ...state.events,
      [eventJSON.id]: eventJSON,
    },
  };
}

export function setName(
  state: State,
  action: types.forecast.SetAccountName,
): State {
  let accountWrappers: AccountWrapper[] = [];

  for (let accountWrapper of state.accountWrappers) {
    if (accountWrapper.account.id === action.accountId) {
      accountWrapper = {
        ...accountWrapper,
        account: {
          ...accountWrapper.account,
          name: action.name,
        },
      };
    }

    accountWrappers = [...accountWrappers, accountWrapper];
  }

  return {
    ...state,
    accountWrappers,
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

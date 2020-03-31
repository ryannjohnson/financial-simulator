import { Effect } from '../../../../timeline';
import * as types from '../../types';
import * as actions from '../../actions';
import { selectTrackItem } from './account';
import { AccountWrapper, State, TrackItem, TrackItemType } from './props';
import * as utils from './utils';

export function add(state: State, action: types.forecast.AddEffect): State {
  const effect = Effect.fromJSON(action.effect);
  console.log(state);

  state = {
    ...state,
    effects: { ...state.effects, [effect.id]: effect.toJSON() },
  };

  const trackItem: TrackItem = {
    id: effect.id,
    type: TrackItemType.Effect,
  };

  state = addEffectIdToAccount(state, action.effect.id, action.accountId);
  state = utils.addTrackItemToEarliestTrack(state, trackItem, action.accountId);
  state = selectTrackItem(state, actions.forecast.selectTrackItem(trackItem));
  console.log(state);
  return state;
}

export function remove(
  state: State,
  action: types.forecast.RemoveEffect,
): State {
  const trackItem: TrackItem = {
    id: action.effectId,
    type: TrackItemType.Effect,
  };

  state = utils.removeTrackItemFromTracks(state, trackItem, null);
  state = selectTrackItem(state, actions.forecast.selectTrackItem(null));

  let accountWrappers: AccountWrapper[] = [];

  for (let accountWrapper of state.accountWrappers) {
    if (accountWrapper.account.effectIds.includes(action.effectId)) {
      accountWrapper = {
        ...accountWrapper,
        account: {
          ...accountWrapper.account,
          effectIds: accountWrapper.account.effectIds.filter(
            a => a !== action.effectId,
          ),
        },
      };
    }

    accountWrappers = [...accountWrappers, accountWrapper];
  }

  const effects = { ...state.effects };
  delete effects[action.effectId];

  return {
    ...state,
    accountWrappers,
    effects,
  };
}

export function set(state: State, action: types.forecast.SetEffect): State {
  const effect = Effect.fromJSON(action.effect);

  return {
    ...state,
    effects: { ...state.effects, [effect.id]: effect.toJSON() },
  };
}

/**
 * Should only be called if the type is Event.
 */
export function setCalendarDates(
  state: State,
  action: types.forecast.SetTrackItemCalendarDates,
): State {
  const effect = Effect.fromJSON({
    ...state.effects[action.trackItem.id],
    endsOn: action.endsOn,
    startsOn: action.startsOn,
  });

  const otherAccountIds = state.accountWrappers
    .filter(
      ({ account }) =>
        account.id !== action.accountId &&
        account.effectIds.includes(effect.id),
    )
    .map(a => a.account.id);

  let ok: boolean;

  ({ ok, state } = utils.setTrackItemCalendarDates(
    state,
    action,
    effect.startsOn,
    effect.endsOn,
    otherAccountIds,
  ));

  if (!ok) {
    return state;
  }

  return {
    ...state,
    effects: { ...state.effects, [effect.id]: effect.toJSON() },
  };
}

export function setEndsOn(
  state: State,
  action: types.forecast.SetTrackItemEndsOn,
): State {
  const effect = Effect.fromJSON(state.effects[action.trackItem.id]);
  const endsOn = utils.toCalendarDateOrNull(action.endsOn);

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setCalendarDates(
    state,
    utils.toSetTrackItemCalendarDatesAction(
      state,
      action,
      effect.startsOn,
      endsOn,
    ),
  );
}

export function setStartsOn(
  state: State,
  action: types.forecast.SetTrackItemStartsOn,
): State {
  const effect = Effect.fromJSON(state.effects[action.trackItem.id]);
  const startsOn = utils.toCalendarDateOrNull(action.startsOn);

  // TODO: Implement logic that tries to snuggle it up close to the
  // nearest obstacle.
  return setCalendarDates(
    state,
    utils.toSetTrackItemCalendarDatesAction(
      state,
      action,
      startsOn,
      effect.endsOn,
    ),
  );
}

function addEffectIdToAccount(
  state: State,
  effectId: string,
  accountId: string,
): State {
  let accountWrappers: AccountWrapper[] = [];

  for (let accountWrapper of state.accountWrappers) {
    if (accountWrapper.account.id === accountId) {
      accountWrapper = {
        ...accountWrapper,
        account: {
          ...accountWrapper.account,
          effectIds: [
            ...accountWrapper.account.effectIds.filter(a => a !== effectId),
            effectId,
          ],
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

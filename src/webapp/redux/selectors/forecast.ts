import { AmountJSON } from '../../../amount';
import { CalendarDateJSON } from '../../../calendar-date';
import {
  CompoundingEffectFormula,
  Effect,
  Event,
  LumpSumFormula,
  MonthlySumFormula,
  RecurringSumFormula,
} from '../../../timeline';
import { toString, TrackItem, TrackItemType } from '../../track-item';
import { State } from '../reducer';

export function getChart(state: State) {
  return state.forecast.chart;
}

export function getEffect(state: State, effectId: string) {
  const effectJSON = state.forecast.effects[effectId];

  if (!effectJSON) {
    throw new Error(`Event by id "${effectId}" does not exist`);
  }

  return effectJSON;
}

export function getEvent(state: State, eventId: string) {
  const eventJSON = state.forecast.events[eventId];

  if (!eventJSON) {
    throw new Error(`Event by id "${eventId}" does not exist`);
  }

  return eventJSON;
}

export type TrackItemDetails = {
  endsOn: CalendarDateJSON | null;
  id: string;
  name: string;
  orientation: Orientation;
  type: TrackItemType;
  shortDescription: string;
  startsOn: CalendarDateJSON | null;
  trackIndex: number;
};

export enum Orientation {
  In = 'IN',
  Neutral = 'NEUTRAL',
  Out = 'OUT',
}

export function getTrackItemDetails(
  state: State,
  trackItem: TrackItem,
  accountId: string,
): TrackItemDetails {
  const trackIndex = getTrackItemTrackIndex(state, trackItem, accountId);
  let orientation = Orientation.Neutral;

  if (trackItem.type === TrackItemType.Effect) {
    const effectJSON = state.forecast.effects[trackItem.id];
    const effect = Effect.fromJSON(effectJSON);
    return {
      ...trackItem,
      shortDescription: effectToShortDescription(effect),
      endsOn: effectJSON.endsOn,
      name: effectJSON.name,
      orientation,
      startsOn: effectJSON.startsOn,
      trackIndex,
    };
  }

  if (trackItem.type === TrackItemType.Event) {
    const eventJSON = state.forecast.events[trackItem.id];
    const event = Event.fromJSON(eventJSON);

    if (eventJSON.fromAccountId === accountId) {
      orientation = Orientation.Out;
    } else if (eventJSON.toAccountId === accountId) {
      orientation = Orientation.In;
    }

    return {
      ...trackItem,
      endsOn: eventJSON.endsOn,
      name: eventJSON.name,
      orientation,
      shortDescription: eventToShortDescription(event, accountId),
      startsOn: eventJSON.startsOn,
      trackIndex,
    };
  }

  throw new Error(`TrackItemType "${trackItem.type}" is not implemented yet`);
}

function effectToShortDescription(effect: Effect): string {
  if (effect.formula instanceof CompoundingEffectFormula) {
    const sign = effect.formula.nominalAnnualInterestRate >= 0 ? '+' : '';
    let percent = (effect.formula.nominalAnnualInterestRate * 100).toFixed(1);
    const frequency = effect.formula.compoundingFrequencyPerYear;

    if (frequency === null) {
      return `${sign}${percent}% compounded continuously`;
    }

    const s = frequency === 1 ? '' : 's';
    return `${sign}${percent}% compounded ${frequency} time${s} annually`;
  }

  return '';
}

function eventToShortDescription(event: Event, accountId: string): string {
  let sign: string;

  if (event.fromAccountId === accountId) {
    sign = '-';
  } else if (event.toAccountId === accountId) {
    sign = '+';
  } else {
    throw new Error(
      `Event "${event.id}" doesn't belong to account "${accountId}"`,
    );
  }

  if (event.formula instanceof LumpSumFormula) {
    return `${sign}${event.formula.amount.toString()} one-time`;
  }

  if (event.formula instanceof MonthlySumFormula) {
    return `${sign}${event.formula.amount.toString()} monthly`;
  }

  if (event.formula instanceof RecurringSumFormula) {
    return `${sign}${event.formula.amount.toString()} every ${
      event.formula.everyXDays
    } days`;
  }

  return '';
}

export function getTrackItemTrackIndex(
  state: State,
  trackItem: TrackItem,
  accountId: string,
) {
  const { tracks } = getAccountWrapper(state, accountId);

  let index = -1;
  for (const track of tracks) {
    index += 1;
    for (const item of track.items) {
      if (item.type === trackItem.type && item.id === trackItem.id) {
        return index;
      }
    }
  }

  throw new Error(
    `Cannot find trackItem by id "${trackItem.id}" and type ${trackItem.type}`,
  );
}

export function getSelectedAccountWrapper(state: State) {
  const { accountId } = state.forecast.timeline;

  if (!accountId) {
    return null;
  }

  return getAccountWrapper(state, accountId);
}

export function getAccountWrappers(state: State) {
  return state.forecast.accountWrappers;
}

export function getAccountWrapper(state: State, accountId: string) {
  const accountWrapper = state.forecast.accountWrappers.find(
    a => a.account.id === accountId,
  );

  if (!accountWrapper) {
    throw new Error(`Account by id "${accountId}" does not exist`);
  }

  return accountWrapper;
}

export function getSelectedTrackItem(state: State) {
  return state.forecast.selectedTrackItem;
}

export function getTimelineChartSampleSize(state: State) {
  return state.forecast.timeline.chartSampleSize;
}

export function getTimelineEndsOn(state: State) {
  return state.forecast.timeline.endsOn;
}

export function getTimelineStartsOn(state: State) {
  return state.forecast.timeline.startsOn;
}

export function getTrack(state: State, id: string) {
  for (const { tracks } of state.forecast.accountWrappers) {
    const track = tracks.find(t => t.id === id);

    if (track) {
      return track;
    }
  }

  throw new Error(`Track not found by id "${id}"`);
}

export function getTrackItemAccruedAmount(
  state: State,
  trackItem: TrackItem,
): AmountJSON | null {
  return state.forecast.trackItemAccruedAmounts[toString(trackItem)] || null;
}

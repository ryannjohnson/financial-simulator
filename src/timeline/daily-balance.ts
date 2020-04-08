import { Currency } from '../amount';
import { CalendarDate } from '../calendar-date';
import { Effect } from './effect';
import { Event } from './event';

type Options = {
  accountId: string;
  currency: Currency;
  durationInDays: number;
  effects: Effect[];
  events: Event[];
  startsOn: CalendarDate;
};

export type DailyBalanceResults = {
  effectStates: EffectState[];
  eventStates: EventState[];
};

export function* calculateDailyBalanceValues({
  accountId,
  currency,
  durationInDays,
  effects,
  events,
  startsOn,
}: Options): Generator<number, DailyBalanceResults> {
  for (const event of events) {
    if (event.formula.getCurrency() !== currency) {
      throw new Error(
        `Currency "${event.formula.getCurrency()}" doesn't match expected "${currency}"`,
      );
    }
  }

  const eventStates: EventState[] = events
    .filter(e => e.fromAccountId === accountId || e.toAccountId === accountId)
    .map(event => ({
      accruedValue: 0,
      event,
      generator: event.yieldBalanceValues(startsOn, durationInDays),
      multiplier: event.toAccountId === accountId ? 1 : -1,
    }));

  const effectStates: EffectState[] = effects.map(effect => ({
    accruedValue: 0,
    effect,
  }));

  let accruedEffects = 0;

  for (let i = 0; i < durationInDays; i++) {
    const newBalance = eventStates
      .map(eventState => {
        const value = eventState.generator.next().value * eventState.multiplier;

        eventState.accruedValue = value;

        return value;
      })
      .reduce(sum, 0);

    accruedEffects += effectStates
      .map(effectState => {
        const value = effectState.effect.yieldsValueOnDay(
          newBalance + accruedEffects,
          i,
          startsOn,
        );

        effectState.accruedValue += value;

        return value;
      })
      .reduce(sum, 0);

    yield Math.round(newBalance + accruedEffects);
  }

  return { effectStates, eventStates };
}

type EventState = {
  accruedValue: number;
  event: Event;
  generator: Generator<number>;
  multiplier: number;
};

type EffectState = {
  accruedValue: number;
  effect: Effect;
};

function sum(acc: number, value: number) {
  return acc + value;
}

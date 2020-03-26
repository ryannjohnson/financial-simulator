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

export function* calculateDailyBalanceValues({
  accountId,
  currency,
  durationInDays,
  effects,
  events,
  startsOn,
}: Options): Generator<number> {
  for (const event of events) {
    if (event.formula.getCurrency() !== currency) {
      throw new Error(
        `Currency "${event.formula.getCurrency()}" doesn't match expected "${currency}"`,
      );
    }
  }

  const eventGenerators = events
    .filter(e => e.fromAccountId === accountId || e.toAccountId === accountId)
    .map(e => ({
      generator: e.yieldBalanceValues(startsOn, durationInDays),
      multiplier: e.toAccountId === accountId ? 1 : -1,
    }));

  let accruedEffects = 0;

  for (let i = 0; i < durationInDays; i++) {
    const newBalance = eventGenerators
      .map(({ generator, multiplier }) => generator.next().value * multiplier)
      .reduce(sum, 0);

    accruedEffects += effects
      .map(e => e.yieldsValueOnDay(newBalance + accruedEffects, i, startsOn))
      .reduce(sum, 0);

    yield Math.round(newBalance + accruedEffects);
  }
}

function sum(acc: number, value: number) {
  return acc + value;
}

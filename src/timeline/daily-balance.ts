import { Currency } from '../amount';
import { CalendarDate } from '../calendar-date';
import { Event } from './event';

type Options = {
  currency: Currency;
  durationInDays: number;
  events: Event[];
  startsOn: CalendarDate;
};

export function* calculateDailyBalanceValues({
  currency,
  durationInDays,
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

  const generators = events.map(e =>
    e.yieldBalanceValues(startsOn, durationInDays),
  );

  for (let i = 0; i < durationInDays; i++) {
    yield generators.map(g => g.next().value).reduce((a, v) => a + v, 0);
  }
}

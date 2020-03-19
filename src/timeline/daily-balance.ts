import { Amount, Currency } from '../amount';
import { CalendarDate } from '../calendar-date';
import { Event } from './event';

type Options = {
  currency: Currency;
  durationInDays: number;
  events: Event[];
  startsOn: CalendarDate;
};

export function calculateDailyBalances({
  currency,
  durationInDays,
  events,
  startsOn,
}: Options): number[] {
  let balance = new Amount(currency, 0);
  let values = Array<number>(durationInDays).fill(0);

  let earliestDate = startsOn;
  for (const event of events) {
    if (earliestDate.daysAfter(event.startsOn) > 0) {
      earliestDate = event.startsOn;
    }
  }

  for (let i = startsOn.daysUntil(earliestDate); i < durationInDays; i++) {
    const date = startsOn.addDays(i);
    for (const event of events) {
      const amountChanged = event.yieldsOn(date);
      balance = balance.add(amountChanged);
    }
    if (i >= 0) {
      values[i] = balance.value;
    }
  }

  return values;
}

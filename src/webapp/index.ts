import App from './App';

export { App };

import { Amount, Currency } from '../amount';
import { CalendarDate, Month } from '../calendar-date';
import {
  calculateDailyBalances,
  ContinuousCompoundingInterestFormula,
  Event,
  LumpSumFormula,
  MonthlySumFormula,
  PeriodicCompoundingInterestFormula,
  RecurringSumFormula,
} from '../timeline';

const events = [
  new Event(
    new LumpSumFormula(toUSD(10000)),
    new CalendarDate(2019, Month.December, 1),
    null,
  ),
  new Event(
    new RecurringSumFormula(toUSD(10000), 14),
    new CalendarDate(2020, Month.January, 1),
    null,
  ),
  new Event(
    new MonthlySumFormula(toUSD(-10000)),
    new CalendarDate(2020, Month.January, 3),
    null,
  ),
  new Event(
    new PeriodicCompoundingInterestFormula(toUSD(10000), 0.1, 12),
    new CalendarDate(2020, Month.January, 9),
    null,
  ),
  new Event(
    new ContinuousCompoundingInterestFormula(toUSD(5000), -0.1),
    new CalendarDate(2020, Month.January, 9),
    null,
  ),
];

function toUSD(x: number): Amount {
  return new Amount(Currency.USD, Math.round(x * 100));
}

console.log(
  calculateDailyBalances({
    currency: Currency.USD,
    durationInDays: 100,
    events,
    startsOn: new CalendarDate(2019, Month.December, 1),
  }),
);

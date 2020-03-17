import App from './App';

export { App };

import { Amount, Currency } from '../amount';
import { CalendarDate, Month } from '../calendar-date';
import {
  getDailyBalances,
  LumpSumEvent,
  MonthlyEvent,
  RegularEvent,
} from '../timeline/daily-balance';

const events = [
  new LumpSumEvent(
    new Amount(Currency.USD, 10000),
    new CalendarDate(2019, Month.December, 1),
  ),
  new RegularEvent(
    14,
    new Amount(Currency.USD, 500000),
    new CalendarDate(2020, Month.January, 1),
  ),
  new RegularEvent(
    21,
    new Amount(Currency.USD, -250000),
    new CalendarDate(2020, Month.January, 3),
  ),
  new MonthlyEvent(
    new Amount(Currency.USD, -100000),
    new CalendarDate(2020, Month.January, 3),
  ),
];

console.log(getDailyBalances(Currency.USD, events, 100));

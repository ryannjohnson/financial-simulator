import App from './App';

export { App };

import { Amount, Currency } from '../amount';
import { CalendarDate, Month } from '../calendar-date';
import {
  BiWeeklyEvent,
  getDailyBalances,
  MonthlyEvent,
} from '../timeline/daily-balance';

const events = [
  new BiWeeklyEvent(
    new Amount(Currency.USD, 500000),
    new CalendarDate(2020, Month.January, 1),
  ),
  new BiWeeklyEvent(
    new Amount(Currency.USD, -250000),
    new CalendarDate(2020, Month.January, 3),
  ),
  new MonthlyEvent(
    new Amount(Currency.USD, -100000),
    new CalendarDate(2020, Month.January, 3),
  ),
];

console.log(getDailyBalances(Currency.USD, events, 100));

import * as React from 'react';

import { Amount, Currency } from '../../amount';
import { CalendarDate, Month } from '../../calendar-date';
import {
  calculateDailyBalanceValues,
  ContinuousCompoundingInterestFormula,
  Event,
  LumpSumFormula,
  MonthlySumFormula,
  RecurringSumFormula,
} from '../../timeline';
import ChartComponent from './Chart.component';

const events = [
  new Event(
    new RecurringSumFormula(toUSD(1000), 14),
    new CalendarDate(2018, Month.January, 1),
    null,
  ),
  new Event(
    new MonthlySumFormula(toUSD(-1000)),
    new CalendarDate(2018, Month.January, 2),
    null,
  ),
  new Event(
    new LumpSumFormula(toUSD(-10000)),
    new CalendarDate(2019, Month.January, 1),
    new CalendarDate(2019, Month.January, 1),
  ),
  new Event(
    new ContinuousCompoundingInterestFormula(toUSD(10000), 0.1),
    new CalendarDate(2019, Month.January, 9),
    null,
  ),
];

function toUSD(x: number): Amount {
  return new Amount(Currency.USD, Math.round(x * 100));
}

const dailyBalances = calculateDailyBalanceValues({
  currency: Currency.USD,
  durationInDays: 365 * 3,
  events,
  startsOn: new CalendarDate(2018, Month.December, 1),
});

export default function DailyBalanceChartComponent() {
  return <ChartComponent width={640} height={480} values={dailyBalances} />;
}

import * as React from 'react';

import { Currency } from '../../amount';
import {
  CalendarDate,
  CalendarDateJSON,
  DAYS_PER_YEAR,
} from '../../calendar-date';
import {
  calculateDailyBalanceValues,
  Effect,
  EffectJSON,
  Event,
  EventJSON,
} from '../../timeline';
import GenericChartComponent, {
  Value as ChartValue,
} from '../components/Chart.component';
import { ChartSampleSize } from '../redux/reducer/forecast/props';

type Props = {
  accountId: string | null;
  chartSampleSize: ChartSampleSize;
  currency: Currency;
  effects: EffectJSON[];
  events: EventJSON[];
  endsOn: CalendarDateJSON;
  startsOn: CalendarDateJSON;
};

export default function ChartComponent({
  accountId,
  chartSampleSize,
  currency,
  effects: effectsJSON,
  endsOn: endsOnJSON,
  events: eventsJSON,
  startsOn: startsOnJSON,
}: Props) {
  const startsOn = CalendarDate.fromJSON(startsOnJSON);
  const endsOn = CalendarDate.fromJSON(endsOnJSON);
  const effects = effectsJSON.map(Effect.fromJSON);
  const events = eventsJSON.map(Event.fromJSON);

  if (!accountId) {
    const values: ChartValue[] = [
      { time: toTime(startsOn), value: 0 },
      { time: toTime(endsOn), value: 0 },
    ];
    return <GenericChartComponent startsOn={startsOnJSON} values={values} />;
  }

  const valueGenerator = calculateDailyBalanceValues({
    accountId,
    currency,
    durationInDays: startsOn.daysBefore(endsOn) + 1,
    effects,
    events,
    startsOn,
  });

  const values: ChartValue[] = [];

  let yearsElapsed = -1;
  let i = -1;
  for (const value of valueGenerator) {
    i += 1;

    if (chartSampleSize === ChartSampleSize.Day) {
      const date = startsOn.addDays(i);
      values.push({
        time: toTime(date),
        value,
      });
      continue;
    }

    if (chartSampleSize === ChartSampleSize.Week) {
      if (i % 7 === 0) {
        const date = startsOn.addDays(i);
        values.push({
          time: toTime(date),
          value,
        });
      }
      continue;
    }

    if (chartSampleSize === ChartSampleSize.Month) {
      const date = startsOn.addDays(i);

      if (date.isSameDayOfMonthAs(startsOn)) {
        values.push({
          time: toTime(date),
          value,
        });
      }

      continue;
    }

    if (chartSampleSize === ChartSampleSize.Year) {
      const year = Math.floor(i / DAYS_PER_YEAR);

      if (yearsElapsed < year) {
        const date = startsOn.addDays(i);
        values.push({
          time: toTime(date),
          value,
        });
        yearsElapsed = year;
      }

      continue;
    }

    throw new Error(`ChartSampleSize "${chartSampleSize}" is not supported`);
  }

  return <GenericChartComponent startsOn={startsOnJSON} values={values} />;
}

function toTime(date: CalendarDate) {
  return {
    year: date.year,
    month: date.month,
    day: date.day,
  };
}

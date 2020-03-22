import { CalendarDate, DAYS_PER_YEAR } from '../../../../calendar-date';
import { calculateDailyBalanceValues, Event } from '../../../../timeline';
import * as types from '../../types';
import { ChartSampleSize, ChartValue, State } from './props';

export function renderChart(
  state: State,
  action: types.forecast.RenderChart,
): State {
  const startsOn = CalendarDate.fromJSON(state.timeline.startsOn);
  const endsOn = CalendarDate.fromJSON(state.timeline.endsOn);

  // TODO: Find more performant way to do this?
  const eventIds = new Set(action.eventIds);
  const events = state.eventWrappers
    .filter(a => eventIds.has(a.id))
    .map(a => Event.fromJSON(a.event));

  const durationInDays = startsOn.daysBefore(endsOn) + 1;

  const valueGenerator = calculateDailyBalanceValues({
    currency: state.chart.currency,
    durationInDays,
    events,
    startsOn,
  });

  const values: ChartValue[] = [];

  let yearsElapsed = -1;
  let i = -1;
  for (const value of valueGenerator) {
    i += 1;

    if (action.sampleSize === ChartSampleSize.Day) {
      const date = startsOn.addDays(i);
      values.push({
        time: toTime(date),
        value,
      });
      continue;
    }

    if (action.sampleSize === ChartSampleSize.Week) {
      if (i % 7 === 0) {
        const date = startsOn.addDays(i);
        values.push({
          time: toTime(date),
          value,
        });
      }
      continue;
    }

    if (action.sampleSize === ChartSampleSize.Month) {
      const date = startsOn.addDays(i);

      if (date.isSameDayOfMonthAs(startsOn)) {
        values.push({
          time: toTime(date),
          value,
        });
      }

      continue;
    }

    if (action.sampleSize === ChartSampleSize.Year) {
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

    throw new Error(`ChartSampleSize "${action.sampleSize}" is not supported`);
  }

  return {
    ...state,
    chart: {
      ...state.chart,
      values,
    },
  };
}

function toTime(date: CalendarDate) {
  return {
    year: date.year,
    month: date.month,
    day: date.day,
  };
}

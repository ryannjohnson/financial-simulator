import { CalendarDate, DAYS_PER_YEAR } from '../../../../calendar-date';
import {
  calculateDailyBalanceValues,
  Effect,
  Event,
} from '../../../../timeline';
import * as types from '../../types';
import { ChartSampleSize, ChartValue, State, TrackItemType } from './props';

export function renderChart(
  state: State,
  action: types.forecast.RenderChart,
): State {
  const startsOn = CalendarDate.fromJSON(state.timeline.startsOn);
  const endsOn = CalendarDate.fromJSON(state.timeline.endsOn);

  const accountWrapper = state.accountWrappers.find(
    a => a.account.id === action.accountId,
  );

  if (!accountWrapper) {
    throw new Error(`Account by id "${action.accountId}" does not exist`);
  }

  let effects: Effect[] = [];
  let events: Event[] = [];

  for (const track of accountWrapper.tracks) {
    for (const trackItem of track.items) {
      if (trackItem.type === TrackItemType.Event) {
        const eventJSON = state.events[trackItem.id];
        events = [...events, Event.fromJSON(eventJSON)];
        continue;
      }

      if (trackItem.type === TrackItemType.Effect) {
        const effectJSON = state.effects[trackItem.id];
        effects = [...effects, Effect.fromJSON(effectJSON)];
        continue;
      }

      throw new Error(`TrackItemType "${trackItem.type}" is not implemented`);
    }
  }

  const durationInDays = startsOn.daysBefore(endsOn) + 1;

  const valueGenerator = calculateDailyBalanceValues({
    accountId: action.accountId,
    currency: state.chart.currency,
    durationInDays,
    effects,
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

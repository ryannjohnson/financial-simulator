import { CalendarDate } from '../../../../calendar-date';
import * as timeline from '../../../../timeline';
import * as types from '../../types';

import { State } from './props';

export function renderChart(
  state: State,
  action: types.forecast.RenderChart,
): State {
  const startsOn = CalendarDate.fromJSON(state.timeline.startsOn);
  const endsOn = CalendarDate.fromJSON(state.timeline.endsOn);

  return {
    ...state,
    chart: {
      ...state.chart,
      values: Array.from(
        timeline.calculateDailyBalanceValues({
          currency: state.chart.currency,
          durationInDays: startsOn.daysBefore(endsOn) + 1,
          events: action.events.map(a => timeline.Event.fromJSON(a)),
          startsOn,
        }),
      ),
    },
  };
}

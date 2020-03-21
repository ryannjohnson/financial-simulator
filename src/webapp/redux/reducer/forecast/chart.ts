import { Currency } from '../../../../amount';
import { CalendarDate, CalendarDateJSON } from '../../../../calendar-date';
import * as timeline from '../../../../timeline';
import * as types from '../../types';

export type State = {
  currency: Currency;
  endsOn: CalendarDateJSON;
  startsOn: CalendarDateJSON;
  values: number[];
};

export function reducer(
  state: State = initialState,
  action: types.forecast.Action,
): State {
  switch (action.type) {
    case types.forecast.RENDER_CHART:
      return renderChart(state, action);
    default:
      return state;
  }
}

const initialState: State = {
  currency: Currency.USD,
  endsOn: CalendarDate.today()
    .addYears(5)
    .toJSON(),
  startsOn: CalendarDate.today().toJSON(),
  values: [],
};

function renderChart(state: State, action: types.forecast.RenderChart) {
  const startsOn = CalendarDate.fromJSON(state.startsOn);
  const endsOn = CalendarDate.fromJSON(state.endsOn);

  return {
    ...state,
    values: Array.from(
      timeline.calculateDailyBalanceValues({
        currency: state.currency,
        durationInDays: startsOn.daysBefore(endsOn) + 1,
        events: action.events.map(a => timeline.Event.fromJSON(a)),
        startsOn,
      }),
    ),
  };
}

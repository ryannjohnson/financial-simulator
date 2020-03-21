import { Amount, Currency } from '../../../amount';
import { CalendarDate, CalendarDateJSON } from '../../../calendar-date';
import * as timeline from '../../../timeline';
import { FormulaType } from '../../../timeline';
import { generateLocalUUID } from '../../../utils';
import * as types from '../types';

export type State = {
  chart: {
    currency: Currency;
    endsOn: CalendarDateJSON;
    startsOn: CalendarDateJSON;
    values: number[];
  };
  eventWrappers: EventJSONWrapper[];
};

export type EventJSONWrapper = {
  event: timeline.EventJSON;
  id: string;
};

export function reducer(
  state: State = initialState,
  action: types.forecast.Action,
): State {
  if (action.type === types.forecast.ADD_EVENT) {
    const { formulaType } = action;
    const amount = Amount.zero(state.chart.currency);
    const today = CalendarDate.today();
    let formula: timeline.Formula;

    if (formulaType === FormulaType.ContinuousCompoundingInterest) {
      formula = new timeline.ContinuousCompoundingInterestFormula(amount, 0);
    } else if (formulaType === FormulaType.LumpSum) {
      formula = new timeline.LumpSumFormula(amount);
    } else if (formulaType === FormulaType.MonthlySum) {
      formula = new timeline.MonthlySumFormula(amount);
    } else if (formulaType === FormulaType.PeriodicCompoundingInterest) {
      formula = new timeline.PeriodicCompoundingInterestFormula(amount, 0, 1);
    } else if (formulaType === FormulaType.RecurringSum) {
      formula = new timeline.RecurringSumFormula(amount, 7);
    } else {
      throw new Error(`FormulaType "${formulaType}" has not been implemented`);
    }

    const eventWrapper: EventJSONWrapper = {
      event: new timeline.Event(formula, today, today).toJSON(),
      id: generateLocalUUID(),
    };

    return {
      ...state,
      eventWrappers: [...state.eventWrappers, eventWrapper],
    };
  }

  if (action.type === types.forecast.EXPORT_EVENTS) {
    const eventsJSON = state.eventWrappers.map(a => a.event);
    const blob = new Blob([JSON.stringify(eventsJSON, null, 2)], {
      type: 'application/json',
    });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    const date = new Date().toISOString();
    a.download = `${date.split('T')[0]}_ForecastEvents.json`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);

    return state;
  }

  if (action.type === types.forecast.IMPORT_EVENTS) {
    state = {
      ...state,
      eventWrappers: action.events.map(event => ({
        id: generateLocalUUID(),
        event,
      })),
    };

    return {
      ...state,
      chart: getChart(state),
    };
  }

  if (action.type === types.forecast.REMOVE_EVENT) {
    return {
      ...state,
      eventWrappers: state.eventWrappers.filter(({ id }) => id !== action.id),
    };
  }

  if (action.type === types.forecast.RENDER_CHART) {
    return {
      ...state,
      chart: getChart(state),
      eventWrappers: [...state.eventWrappers].sort(byStartsOn),
    };
  }

  if (action.type === types.forecast.SET_EVENT) {
    let eventWrappers: EventJSONWrapper[] = [];

    for (const eventWrapper of state.eventWrappers) {
      if (eventWrapper.id !== action.id) {
        eventWrappers = [...eventWrappers, eventWrapper];
      } else {
        const newEventWrapper = { id: action.id, event: action.event };
        eventWrappers = [...eventWrappers, newEventWrapper];
      }
    }

    return {
      ...state,
      eventWrappers,
    };
  }

  return state;
}

const initialState: State = {
  chart: {
    currency: Currency.USD,
    endsOn: CalendarDate.today()
      .addYears(5)
      .toJSON(),
    startsOn: CalendarDate.today().toJSON(),
    values: [],
  },
  eventWrappers: [],
};

function byStartsOn(a: EventJSONWrapper, b: EventJSONWrapper): number {
  return (
    a.event.startsOn.localeCompare(b.event.startsOn) || a.id.localeCompare(b.id)
  );
}

function getChart(state: State) {
  const startsOn = CalendarDate.fromJSON(state.chart.startsOn);
  const endsOn = CalendarDate.fromJSON(state.chart.endsOn);

  return {
    ...state.chart,
    values: Array.from(
      timeline.calculateDailyBalanceValues({
        currency: state.chart.currency,
        durationInDays: startsOn.daysBefore(endsOn) + 1,
        events: state.eventWrappers.map(a => timeline.Event.fromJSON(a.event)),
        startsOn,
      }),
    ),
  };
}

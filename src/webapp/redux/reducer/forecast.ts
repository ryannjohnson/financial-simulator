import { Amount, Currency } from '../../../amount';
import { CalendarDate } from '../../../calendar-date';
import * as timeline from '../../../timeline';
import { FormulaType } from '../../../timeline';
import { generateLocalUUID } from '../../../utils';
import * as types from '../types';

export type State = {
  chartValues: number[];
  defaultCurrency: Currency;
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
    const amount = Amount.zero(state.defaultCurrency);
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
      eventWrappers: [...state.eventWrappers, eventWrapper].sort(byStartsOn),
    };
  }

  if (action.type === types.forecast.RENDER_CHART) {
    const chartValues = Array.from(
      timeline.calculateDailyBalanceValues({
        currency: state.defaultCurrency,
        durationInDays: 365,
        events: state.eventWrappers.map(a => timeline.Event.fromJSON(a.event)),
        startsOn: CalendarDate.today(),
      }),
    );

    return {
      ...state,
      chartValues,
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
  chartValues: [],
  defaultCurrency: Currency.USD,
  eventWrappers: [],
};

function byStartsOn(a: EventJSONWrapper, b: EventJSONWrapper): number {
  return (
    a.event.startsOn.localeCompare(b.event.startsOn) || a.id.localeCompare(b.id)
  );
}

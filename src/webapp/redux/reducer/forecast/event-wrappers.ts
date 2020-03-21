import { Amount } from '../../../../amount';
import { CalendarDate } from '../../../../calendar-date';
import * as timeline from '../../../../timeline';
import { FormulaType } from '../../../../timeline';
import { generateLocalUUID } from '../../../../utils';
import * as types from '../../types';

export type State = EventJSONWrapper[];

export type EventJSONWrapper = {
  event: timeline.EventJSON;
  id: string;
};

export function reducer(
  state: State = initialState,
  action: types.forecast.Action,
): State {
  switch (action.type) {
    case types.forecast.ADD_EVENT:
      return addEvent(state, action);
    case types.forecast.EXPORT_EVENTS:
      return exportEvents(state, action);
    case types.forecast.IMPORT_EVENTS:
      return importEvents(state, action);
    case types.forecast.REMOVE_EVENT:
      return removeEvent(state, action);
    case types.forecast.SET_EVENT:
      return setEvent(state, action);
    default:
      return state;
  }
}

const initialState: State = [];

function addEvent(state: State, action: types.forecast.AddEvent) {
  const { formulaType } = action;
  const amount = Amount.zero(action.currency);
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

  return [...state, eventWrapper];
}

function exportEvents(state: State, _: types.forecast.ExportEvents) {
  const eventsJSON = state.map(a => a.event);
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

function importEvents(_: State, action: types.forecast.ImportEvents) {
  return action.events.map(event => ({
    id: generateLocalUUID(),
    event,
  }));
}

function removeEvent(state: State, action: types.forecast.RemoveEvent) {
  return state.filter(({ id }) => id !== action.id);
}

function setEvent(state: State, action: types.forecast.SetEvent) {
  let eventWrappers: EventJSONWrapper[] = [];

  for (const eventWrapper of state) {
    if (eventWrapper.id !== action.id) {
      eventWrappers = [...eventWrappers, eventWrapper];
    } else {
      const newEventWrapper = { id: action.id, event: action.event };
      eventWrappers = [...eventWrappers, newEventWrapper];
    }
  }

  return eventWrappers;
}

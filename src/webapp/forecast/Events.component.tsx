import * as React from 'react';

import { Amount, Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';
import {
  ContinuousCompoundingInterestFormula,
  Event,
  EventJSON,
  Formula,
  FormulaType,
  LumpSumFormula,
  MonthlySumFormula,
  PeriodicCompoundingInterestFormula,
  RecurringSumFormula,
} from '../../timeline';
import * as actions from '../redux/actions';
import EventContainer from './Event.container';
import RenderChartContainer from './RenderChart.container';

const DEFAULT_FORMULA_TYPE = FormulaType.RecurringSum;

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  exportEvents: typeof actions.forecast.exportEvents;
  importEvents: typeof actions.forecast.importEvents;
  selectedEventId: string | null;
};

export default function EventsComponent({
  addEvent,
  exportEvents,
  importEvents,
  selectedEventId,
}: Props) {
  const [selectedFormulaType, selectFormulaType] = React.useState(
    DEFAULT_FORMULA_TYPE,
  );

  const importEventsHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    reader.onload = () => {
      const eventsJSON: EventJSON[] = JSON.parse(reader.result as string);
      const events = eventsJSON.map(a => Event.fromJSON(a));
      importEvents(events);
    };
    reader.readAsText(event.target.files![0]);
  };

  return (
    <div>
      <input onChange={importEventsHandler} type="file" />
      <button onClick={exportEvents}>Export</button>
      <RenderChartContainer />

      <hr />

      {selectedEventId && (
        <>
          <EventContainer eventId={selectedEventId} />
          <hr />
        </>
      )}

      <select
        onChange={event => selectFormulaType(event.target.value as any)}
        value={selectedFormulaType}
      >
        {formulaTypes.map(formulaType => (
          <option key={formulaType} value={formulaType}>
            {formulaType}
          </option>
        ))}
      </select>

      <button onClick={() => addEvent(newEvent(selectedFormulaType))}>
        + Add
      </button>
    </div>
  );
}

const formulaTypes = Object.values(FormulaType);

function newEvent(formulaType: FormulaType) {
  const amount = Amount.zero(Currency.USD);
  const startsOn = CalendarDate.today();
  let endsOn = startsOn.addMonths(1);
  let formula: Formula;

  if (formulaType === FormulaType.ContinuousCompoundingInterest) {
    formula = new ContinuousCompoundingInterestFormula(amount, 0);
    endsOn = startsOn.addYears(1);
  } else if (formulaType === FormulaType.LumpSum) {
    formula = new LumpSumFormula(amount);
    endsOn = startsOn;
  } else if (formulaType === FormulaType.MonthlySum) {
    formula = new MonthlySumFormula(amount);
  } else if (formulaType === FormulaType.PeriodicCompoundingInterest) {
    formula = new PeriodicCompoundingInterestFormula(amount, 0, 1);
    endsOn = startsOn.addYears(1);
  } else if (formulaType === FormulaType.RecurringSum) {
    formula = new RecurringSumFormula(amount, 7);
  } else {
    throw new Error(`FormulaType "${formulaType}" has not been implemented`);
  }

  return new Event(formula, startsOn, endsOn);
}

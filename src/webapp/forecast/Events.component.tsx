import * as React from 'react';

import { Amount, Currency } from '../../amount';
import { CalendarDate, CalendarDateJSON } from '../../calendar-date';
import {
  Event,
  EventJSON,
  EventFormula,
  EventFormulaType,
  LumpSumFormula,
  MonthlySumFormula,
  RecurringSumFormula,
} from '../../timeline';
import * as actions from '../redux/actions';
import Row from './components/Row.component';
import RowItem from './components/RowItem.component';
import EventContainer from './Event.container';
import CalendarDateComponent from '../components/CalendarDate.component';
import FormElementComponent from '../components/FormElement.component';
import RenderChartContainer from './RenderChart.container';

const DEFAULT_FORMULA_TYPE = EventFormulaType.LumpSum;

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  exportEvents: typeof actions.forecast.exportEvents;
  importEvents: typeof actions.forecast.importEvents;
  selectedEventId: string | null;
  setTimelineCalendarDates: typeof actions.forecast.setTimelineCalendarDates;
  timelineEndsOn: CalendarDateJSON;
  timelineStartsOn: CalendarDateJSON;
};

export default function EventsComponent({
  addEvent,
  exportEvents,
  importEvents,
  selectedEventId,
  setTimelineCalendarDates,
  timelineEndsOn,
  timelineStartsOn,
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
      <RenderChartContainer />
      <button onClick={exportEvents}>Export</button>
      <input onChange={importEventsHandler} type="file" />

      <hr />

      <Row>
        <RowItem>
          <FormElementComponent title="Timeline starts">
            <CalendarDateComponent
              setValue={value => {
                setTimelineCalendarDates(
                  value,
                  CalendarDate.fromJSON(timelineEndsOn),
                );
              }}
              value={timelineStartsOn}
            />
          </FormElementComponent>
        </RowItem>
        <RowItem>
          <FormElementComponent title="Timeline ends">
            <CalendarDateComponent
              setValue={value => {
                setTimelineCalendarDates(
                  CalendarDate.fromJSON(timelineStartsOn),
                  value,
                );
              }}
              value={timelineEndsOn}
            />
          </FormElementComponent>
        </RowItem>
      </Row>

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

const formulaTypes = Object.values(EventFormulaType);

function newEvent(formulaType: EventFormulaType) {
  const amount = Amount.zero(Currency.USD);
  const startsOn = CalendarDate.today();
  const endsOn = startsOn.addMonths(1);
  let formula: EventFormula;

  if (formulaType === EventFormulaType.LumpSum) {
    formula = new LumpSumFormula(amount, 0, null);
  } else if (formulaType === EventFormulaType.MonthlySum) {
    formula = new MonthlySumFormula(amount);
  } else if (formulaType === EventFormulaType.RecurringSum) {
    formula = new RecurringSumFormula(amount, 7);
  } else {
    throw new Error(`FormulaType "${formulaType}" has not been implemented`);
  }

  return new Event(formula, startsOn, endsOn, '');
}

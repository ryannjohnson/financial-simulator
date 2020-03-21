import * as React from 'react';

import { Currency } from '../../amount';
import { Event, EventJSON, FormulaType } from '../../timeline';
import * as actions from '../redux/actions';
import EventContainer from './Event.container';
import RenderChartContainer from './RenderChart.container';

const DEFAULT_FORMULA_TYPE = FormulaType.RecurringSum;

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  eventIds: string[];
  exportEvents: typeof actions.forecast.exportEvents;
  importEvents: typeof actions.forecast.importEvents;
};

export default function EventsComponent({
  addEvent,
  eventIds,
  exportEvents,
  importEvents,
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

      <div>
        {eventIds.map(eventId => (
          <EventContainer key={eventId} eventId={eventId} />
        ))}
      </div>

      <hr />

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

      <button onClick={() => addEvent(selectedFormulaType, Currency.USD)}>
        + Add
      </button>
    </div>
  );
}

const formulaTypes = Object.values(FormulaType);

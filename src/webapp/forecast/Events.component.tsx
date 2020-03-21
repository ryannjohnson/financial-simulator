import * as React from 'react';

import { Event, EventJSON, FormulaType } from '../../timeline';
import * as actions from '../redux/actions';
import EventContainer from './Event.container';

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  eventIds: string[];
  exportEvents: typeof actions.forecast.exportEvents;
  importEvents: typeof actions.forecast.importEvents;
  renderChart: typeof actions.forecast.renderChart;
};

export default function EventsComponent({
  addEvent,
  eventIds,
  exportEvents,
  importEvents,
  renderChart,
}: Props) {
  const [selectedFormulaType, selectFormulaType] = React.useState(
    FormulaType.LumpSum,
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
      <button onClick={renderChart}>Render</button>

      <div>
        {eventIds.map(eventId => (
          <EventContainer key={eventId} eventId={eventId} />
        ))}
      </div>

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

      <button onClick={() => addEvent(selectedFormulaType)}>+ Add</button>
    </div>
  );
}

const formulaTypes = Object.values(FormulaType);

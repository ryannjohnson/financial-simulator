import * as React from 'react';

import { FormulaType } from '../../timeline';
import * as actions from '../redux/actions';
import EventContainer from './Event.container';

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  eventIds: string[];
  renderChart: typeof actions.forecast.renderChart;
};

export default function EventsComponent({
  addEvent,
  eventIds,
  renderChart,
}: Props) {
  const [selectedFormulaType, selectFormulaType] = React.useState(
    FormulaType.LumpSum,
  );

  const addEventHandler = React.useCallback(
    () => addEvent(selectedFormulaType),
    [selectedFormulaType],
  );

  const setFormulaTypeHandler = React.useCallback(
    event => {
      selectFormulaType(event.target.value);
    },
    [selectedFormulaType],
  );

  return (
    <div>
      <button onClick={React.useCallback(() => renderChart(), [])}>
        Render chart
      </button>

      <div>
        {eventIds.map(eventId => (
          <EventContainer key={eventId} eventId={eventId} />
        ))}
      </div>

      <select onChange={setFormulaTypeHandler} value={selectedFormulaType}>
        {formulaTypes.map(formulaType => (
          <option key={formulaType} value={formulaType}>
            {formulaType}
          </option>
        ))}
      </select>

      <button onClick={addEventHandler}>+ Add</button>
    </div>
  );
}

const formulaTypes = Object.values(FormulaType);

import * as React from 'react';

import { FormulaType } from '../../timeline';
import * as actions from '../redux/actions';
import { EventJSONWrapper } from '../redux/reducer/forecast';
import EventComponent from './Event.component';

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  eventWrappers: EventJSONWrapper[];
  renderChart: typeof actions.forecast.renderChart;
  setEvent: typeof actions.forecast.setEvent;
};

export default function EventsComponent({
  addEvent,
  eventWrappers,
  renderChart,
  setEvent,
}: Props) {
  const [selectedFormulaType, selectFormulaType] = React.useState(
    FormulaType.LumpSum,
  );

  const addEventHandler = React.useCallback(
    () => addEvent(selectedFormulaType),
    [selectedFormulaType],
  );

  const renderChartHandler = React.useCallback(() => renderChart(), []);

  const setFormulaTypeHandler = React.useCallback(
    event => {
      selectFormulaType(event.target.value);
    },
    [selectedFormulaType],
  );

  return (
    <div>
      <button onClick={renderChartHandler}>Render chart</button>
      <ul>
        {eventWrappers.map(({ event, id }) => (
          <EventComponent key={id} {...event} setEvent={e => setEvent(id, e)} />
        ))}
      </ul>
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

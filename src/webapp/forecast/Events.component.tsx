import * as React from 'react';

import { FormulaType } from '../../timeline';
import * as actions from '../redux/actions';
import { EventJSONWrapper } from '../redux/reducer/forecast';
import EventComponent from './Event.component';

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  eventWrappers: EventJSONWrapper[];
};

export default function EventsComponent({ addEvent, eventWrappers }: Props) {
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
      <ul>
        {eventWrappers.map(({ event, id }) => (
          <EventComponent key={id} {...event} />
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

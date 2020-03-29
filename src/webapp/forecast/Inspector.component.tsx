import * as React from 'react';

import { Amount, Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';
import {
  Event,
  EventFormula,
  EventFormulaType,
  LumpSumFormula,
  MonthlySumFormula,
  RecurringSumFormula,
} from '../../timeline';
import { generateLocalUUID } from '../../utils';
import * as colors from '../colors';
import * as actions from '../redux/actions';
import { TrackItem, TrackItemType } from '../redux/reducer/forecast/props';
import EventContainer from './Event.container';

const DEFAULT_FORMULA_TYPE = EventFormulaType.LumpSum;

type Props = {
  addEvent: typeof actions.forecast.addEvent;
  exportTimeline: typeof actions.forecast.exportTimeline;
  importTimeline: typeof actions.forecast.importTimeline;
  selectedAccountId: string | null;
  selectedTrackItem: TrackItem | null;
};

export default function InspectorComponent({
  addEvent,
  exportTimeline,
  importTimeline,
  selectedAccountId,
  selectedTrackItem,
}: Props) {
  const [selectedFormulaType, selectFormulaType] = React.useState(
    DEFAULT_FORMULA_TYPE,
  );

  const importTimelineHandler = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const reader = new FileReader();
    reader.onload = () => {
      importTimeline(JSON.parse(reader.result as string));
    };
    reader.readAsText(event.target.files![0]);
  };

  return (
    <div style={containerStyle}>
      <button onClick={exportTimeline}>Export</button>
      <input onChange={importTimelineHandler} type="file" />

      <hr />

      {selectedTrackItem && (
        <>
          <TrackItemComponent {...selectedTrackItem} />
          <hr />
        </>
      )}

      {selectedAccountId && (
        <>
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

          <button
            onClick={() =>
              addEvent(newEvent(selectedAccountId, selectedFormulaType))
            }
          >
            + Add
          </button>
        </>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: colors.DARKBLACK,
  height: '100%',
};

function TrackItemComponent(props: TrackItem) {
  switch (props.type) {
    case TrackItemType.Event:
      return <EventContainer eventId={props.id} />;
    default:
      return <div>Not implemented</div>;
  }
}

const formulaTypes = Object.values(EventFormulaType);

function newEvent(toAccountId: string, formulaType: EventFormulaType) {
  const amount = Amount.zero(Currency.USD);
  const startsOn = CalendarDate.today();
  const endsOn = startsOn.addMonths(1);
  let formula: EventFormula;

  if (formulaType === EventFormulaType.LumpSum) {
    formula = new LumpSumFormula(amount);
  } else if (formulaType === EventFormulaType.MonthlySum) {
    formula = new MonthlySumFormula(amount);
  } else if (formulaType === EventFormulaType.RecurringSum) {
    formula = new RecurringSumFormula(amount, 7);
  } else {
    throw new Error(`FormulaType "${formulaType}" has not been implemented`);
  }

  const id = generateLocalUUID();
  const fromAccountId = null;
  const name = '';

  return new Event(
    id,
    fromAccountId,
    toAccountId,
    formula,
    startsOn,
    endsOn,
    name,
  );
}

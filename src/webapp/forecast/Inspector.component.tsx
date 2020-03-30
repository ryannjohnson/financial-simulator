import * as React from 'react';

import { Amount, Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';
import {
  CompoundingEffectFormula,
  Effect,
  EffectFormula,
  EffectFormulaType,
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
import EffectContainer from './effect/Effect.container';
import EventContainer from './event/Event.container';
import styles from './Inspector.css';

const DEFAULT_EFFECT_FORMULA_TYPE = EffectFormulaType.Compounding;
const DEFAULT_EVENT_FORMULA_TYPE = EventFormulaType.LumpSum;

type Props = {
  addEffect: typeof actions.forecast.addEffect;
  addEvent: typeof actions.forecast.addEvent;
  exportTimeline: typeof actions.forecast.exportTimeline;
  importTimeline: typeof actions.forecast.importTimeline;
  selectedAccountId: string | null;
  selectedTrackItem: TrackItem | null;
};

export default function InspectorComponent({
  addEffect,
  addEvent,
  exportTimeline,
  importTimeline,
  selectedAccountId,
  selectedTrackItem,
}: Props) {
  const [selectedEffectFormulaType, selectEffectFormulaType] = React.useState(
    DEFAULT_EFFECT_FORMULA_TYPE,
  );
  const [selectedEventFormulaType, selectEventFormulaType] = React.useState(
    DEFAULT_EVENT_FORMULA_TYPE,
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
    <div className={styles.container}>
      <div className={styles.header}>Inspector</div>
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
        <div>
          <select
            onChange={effect =>
              selectEffectFormulaType(effect.target.value as any)
            }
            value={selectedEffectFormulaType}
          >
            {effectFormulaTypes.map(formulaType => (
              <option key={formulaType} value={formulaType}>
                {formulaType}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              addEffect(selectedAccountId, newEffect(selectedEffectFormulaType))
            }
          >
            + Add Effect
          </button>
          <hr />
          <select
            onChange={event =>
              selectEventFormulaType(event.target.value as any)
            }
            value={selectedEventFormulaType}
          >
            {eventFormulaTypes.map(formulaType => (
              <option key={formulaType} value={formulaType}>
                {formulaType}
              </option>
            ))}
          </select>

          <button
            onClick={() =>
              addEvent(newEvent(selectedAccountId, selectedEventFormulaType))
            }
          >
            + Add Event
          </button>
        </div>
      )}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: colors.DARKBLACK,
  minHeight: '100%',
};

function TrackItemComponent(props: TrackItem) {
  switch (props.type) {
    case TrackItemType.Effect:
      return <EffectContainer effectId={props.id} />;
    case TrackItemType.Event:
      return <EventContainer eventId={props.id} />;
    default:
      return <div>Not implemented</div>;
  }
}

const effectFormulaTypes = Object.values(EffectFormulaType).sort();
const eventFormulaTypes = Object.values(EventFormulaType).sort();

function newEffect(formulaType: EffectFormulaType) {
  let formula: EffectFormula;

  if (formulaType === EffectFormulaType.Compounding) {
    formula = new CompoundingEffectFormula(0, 0);
  } else {
    throw new Error(`FormulaType "${formulaType}" has not been implemented`);
  }

  const id = generateLocalUUID();
  const name = '';
  const startsOn = null;
  const endsOn = null;

  return new Effect(id, formula, startsOn, endsOn, name);
}

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

import classnames from 'classnames';
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
import * as actions from '../redux/actions';
import { TrackItem, TrackItemType } from '../redux/reducer/forecast/props';
import EffectContainer from './effect/Effect.container';
import EventContainer from './event/Event.container';
import styles from './Inspector.css';

type Props = {
  addEffect: typeof actions.forecast.addEffect;
  addEvent: typeof actions.forecast.addEvent;
  exportTimeline: typeof actions.forecast.exportTimeline;
  importTimeline: typeof actions.forecast.importTimeline;
  removeEffect: typeof actions.forecast.removeEffect;
  removeEvent: typeof actions.forecast.removeEvent;
  selectedAccountId: string | null;
  selectedTrackItem: TrackItem | null;
};

export default function InspectorComponent({
  addEffect,
  addEvent,
  exportTimeline,
  importTimeline,
  removeEffect,
  removeEvent,
  selectedAccountId,
  selectedTrackItem,
}: Props) {
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
      <button onClick={exportTimeline}>Export</button>
      <input onChange={importTimelineHandler} type="file" />

      {selectedAccountId && (
        <>
          <Header title="Account" />
          <div className={styles.content}>
            <button
              className={classnames(
                styles['wide-button'],
                styles['wide-button-EFFECT'],
              )}
              onClick={() =>
                addEffect(
                  selectedAccountId,
                  newEffect(EffectFormulaType.Compounding),
                )
              }
            >
              + Add Compounding Interest
            </button>
            <button
              className={classnames(
                styles['wide-button'],
                styles['wide-button-EVENT-IN'],
              )}
              onClick={() =>
                addEvent(
                  newEvent(
                    selectedAccountId,
                    EventFormulaType.MonthlySum,
                    true,
                  ),
                )
              }
            >
              + Add Income
            </button>
            <button
              className={classnames(
                styles['wide-button'],
                styles['wide-button-EVENT-OUT'],
              )}
              onClick={() =>
                addEvent(
                  newEvent(
                    selectedAccountId,
                    EventFormulaType.MonthlySum,
                    false,
                  ),
                )
              }
            >
              + Add Expense
            </button>
          </div>
        </>
      )}

      {selectedTrackItem && (
        <TrackItemComponent
          removeEffect={removeEffect}
          removeEvent={removeEvent}
          trackItem={selectedTrackItem}
        />
      )}
    </div>
  );
}

type TrackItemComponentProps = {
  removeEffect: typeof actions.forecast.removeEffect;
  removeEvent: typeof actions.forecast.removeEvent;
  trackItem: TrackItem;
};

function TrackItemComponent({
  removeEffect,
  removeEvent,
  trackItem,
}: TrackItemComponentProps) {
  switch (trackItem.type) {
    case TrackItemType.Effect:
      return (
        <>
          <Header title="Effect">
            <HeaderButton onClick={() => removeEffect(trackItem.id)}>
              🗑
            </HeaderButton>
          </Header>
          <div className={styles.content}>
            <EffectContainer effectId={trackItem.id} />
          </div>
        </>
      );
    case TrackItemType.Event:
      return (
        <>
          <Header title="Event">
            <HeaderButton onClick={() => removeEvent(trackItem.id)}>
              🗑
            </HeaderButton>
          </Header>
          <div className={styles.content}>
            <EventContainer eventId={trackItem.id} />
          </div>
        </>
      );
    default:
      return <div className={styles.header}>(not implemented)</div>;
  }
}

type HeaderProps = {
  children?: React.ReactNode;
  title: string;
};

function Header({ children, title }: HeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles['header-title']}>{title}</span>
      <div className={styles['header-children']}>{children}</div>
    </div>
  );
}

type HeaderButtonProps = React.DetailedHTMLProps<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>;

function HeaderButton({ children, ...props }: HeaderButtonProps) {
  return (
    <button className={styles['header-button']} {...props}>
      {children}
    </button>
  );
}

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

function newEvent(
  accountId: string,
  formulaType: EventFormulaType,
  isIncome: boolean,
) {
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
  let fromAccountId: string | null = null;
  let toAccountId: string | null = accountId;
  if (!isIncome) {
    fromAccountId = accountId;
    toAccountId = null;
  }
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

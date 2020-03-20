import * as React from 'react';

import { CalendarDate } from '../../calendar-date';
import * as timeline from '../../timeline';
import AmountComponent from '../Amount.component';

type Props = timeline.EventJSON & {
  setEvent: (event: timeline.Event) => void;
};

export default function EventsComponent({
  endsOn,
  formula,
  formulaType,
  setEvent,
  startsOn,
}: Props) {
  const setEventHandler = React.useCallback(
    formula => {
      const startsOnDate = CalendarDate.fromJSON(startsOn);
      const endsOnDate = endsOn ? CalendarDate.fromJSON(endsOn) : null;
      const event = new timeline.Event(formula, startsOnDate, endsOnDate);
      setEvent(event);
    },
    [endsOn, formula, formulaType, startsOn],
  );

  if (formulaType === timeline.FormulaType.LumpSum) {
    return (
      <li>
        <LumpSumComponent {...formula} setFormula={setEventHandler} />
      </li>
    );
  }

  return <li>{formulaType}</li>;
}

type FormulaWrapper = {
  setFormula: (formula: timeline.Formula) => void;
};

function LumpSumComponent({
  amount,
  setFormula,
}: FormulaWrapper & timeline.LumpSumFormulaJSON) {
  const setAmountHandler = React.useCallback(
    newAmount => {
      setFormula(new timeline.LumpSumFormula(newAmount));
    },
    [amount],
  );

  return (
    <div>
      <AmountComponent {...amount} setAmount={setAmountHandler} />
    </div>
  );
}

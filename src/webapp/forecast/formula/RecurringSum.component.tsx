import * as React from 'react';

import * as timeline from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import FormElementComponent from '../../components/FormElement.component';
import NumberComponent from '../../components/Number.component';
import { FormulaProps } from './props';

export default function RecurringSumComponent({
  amount,
  everyXDays,
  setFormula,
}: FormulaProps & timeline.RecurringSumFormulaJSON) {
  return (
    <div>
      <FormElementComponent title="Amount">
        <AmountComponent
          {...amount}
          setAmount={newAmount => {
            setFormula(new timeline.RecurringSumFormula(newAmount, everyXDays));
          }}
        />
      </FormElementComponent>
      <FormElementComponent title="Every X days">
        <NumberComponent
          setValue={newEveryXDays => {
            setFormula(
              timeline.RecurringSumFormula.fromJSON({
                amount,
                everyXDays: newEveryXDays,
              }),
            );
          }}
          step={1}
          value={everyXDays}
        />
      </FormElementComponent>
    </div>
  );
}

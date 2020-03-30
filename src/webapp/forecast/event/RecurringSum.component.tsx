import * as React from 'react';

import * as timeline from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import FormElementComponent from '../../components/FormElement.component';
import NumberComponent from '../../components/Number.component';
import { EventFormulaProps } from './props';

export default function RecurringSumComponent({
  amount,
  everyXDays,
  setFormula,
}: EventFormulaProps & timeline.RecurringSumFormulaJSON) {
  return (
    <>
      <FormElementComponent title="Amount">
        <AmountComponent
          {...amount}
          min={0}
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
          min={0}
          step={1}
          value={everyXDays}
        />
      </FormElementComponent>
    </>
  );
}

import * as React from 'react';

import { LumpSumFormula, LumpSumFormulaJSON } from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import FormElementComponent from '../../components/FormElement.component';
import { EventFormulaProps } from './props';

export default function LumpSumComponent({
  amount,
  setFormula,
}: EventFormulaProps & LumpSumFormulaJSON) {
  return (
    <>
      <FormElementComponent title="Amount">
        <AmountComponent
          {...amount}
          min={0}
          setAmount={amount => setFormula(new LumpSumFormula(amount))}
        />
      </FormElementComponent>
    </>
  );
}

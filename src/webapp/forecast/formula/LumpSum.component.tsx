import * as React from 'react';

import * as timeline from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import FormElementComponent from '../../components/FormElement.component';
import { FormulaProps } from './props';

export default function LumpSumComponent({
  amount,
  setFormula,
}: FormulaProps & timeline.LumpSumFormulaJSON) {
  return (
    <div>
      <FormElementComponent title="Amount">
        <AmountComponent
          {...amount}
          setAmount={newAmount => {
            setFormula(new timeline.LumpSumFormula(newAmount));
          }}
        />
      </FormElementComponent>
    </div>
  );
}

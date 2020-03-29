import * as React from 'react';

import * as timeline from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import FormElementComponent from '../../components/FormElement.component';
import { EventFormulaProps } from './props';

export default function MonthlySumComponent({
  amount,
  setFormula,
}: EventFormulaProps & timeline.MonthlySumFormulaJSON) {
  return (
    <div>
      <FormElementComponent title="Amount">
        <AmountComponent
          {...amount}
          min={0}
          setAmount={newAmount => {
            setFormula(new timeline.MonthlySumFormula(newAmount));
          }}
        />
      </FormElementComponent>
    </div>
  );
}

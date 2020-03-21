import * as React from 'react';

import * as timeline from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import FormElementComponent from '../../components/FormElement.component';
import NumberComponent from '../../components/Number.component';
import { FormulaProps } from './props';

export default function ContinuousCompoundingInterestComponent({
  nominalAnnualInterestRate,
  principalSum,
  setFormula,
}: FormulaProps & timeline.ContinuousCompoundingInterestFormulaJSON) {
  return (
    <div>
      <FormElementComponent title="Principal sum">
        <AmountComponent
          {...principalSum}
          setAmount={newPrincipalSum => {
            setFormula(
              timeline.ContinuousCompoundingInterestFormula.fromJSON({
                principalSum: newPrincipalSum.toJSON(),
                nominalAnnualInterestRate,
              }),
            );
          }}
        />
      </FormElementComponent>
      <FormElementComponent title="Nominal annual interest rate">
        <NumberComponent
          value={nominalAnnualInterestRate}
          setValue={newNominalAnnualInterestRate => {
            setFormula(
              timeline.ContinuousCompoundingInterestFormula.fromJSON({
                principalSum,
                nominalAnnualInterestRate: newNominalAnnualInterestRate,
              }),
            );
          }}
        />
      </FormElementComponent>
    </div>
  );
}

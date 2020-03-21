import * as React from 'react';

import * as timeline from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import FormElementComponent from '../../components/FormElement.component';
import NumberComponent from '../../components/Number.component';
import { FormulaProps } from './props';

export default function PeriodicCompoundingInterestComponent({
  compoundingFrequencyPerYear,
  nominalAnnualInterestRate,
  principalSum,
  setFormula,
}: FormulaProps & timeline.PeriodicCompoundingInterestFormulaJSON) {
  return (
    <div>
      <FormElementComponent title="Principal sum">
        <AmountComponent
          {...principalSum}
          setAmount={newPrincipalSum => {
            setFormula(
              timeline.PeriodicCompoundingInterestFormula.fromJSON({
                compoundingFrequencyPerYear,
                nominalAnnualInterestRate,
                principalSum: newPrincipalSum.toJSON(),
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
              timeline.PeriodicCompoundingInterestFormula.fromJSON({
                compoundingFrequencyPerYear,
                nominalAnnualInterestRate: newNominalAnnualInterestRate,
                principalSum,
              }),
            );
          }}
        />
      </FormElementComponent>
      <FormElementComponent title="Compounding frequency per year">
        <NumberComponent
          value={compoundingFrequencyPerYear}
          setValue={newCompoundingFrequencyPerYear => {
            setFormula(
              timeline.PeriodicCompoundingInterestFormula.fromJSON({
                compoundingFrequencyPerYear: newCompoundingFrequencyPerYear,
                nominalAnnualInterestRate,
                principalSum,
              }),
            );
          }}
        />
      </FormElementComponent>
    </div>
  );
}

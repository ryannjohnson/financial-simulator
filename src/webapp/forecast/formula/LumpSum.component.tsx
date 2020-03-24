import * as React from 'react';

import { LumpSumFormula, LumpSumFormulaJSON } from '../../../timeline';
import AmountComponent from '../../components/Amount.component';
import NumberComponent from '../../components/Number.component';
import FormElementComponent from '../../components/FormElement.component';
import { EventFormulaProps } from './props';

export default function LumpSumComponent({
  compoundingFrequencyPerYear,
  nominalAnnualInterestRate,
  principalSum,
  setFormula,
}: EventFormulaProps & LumpSumFormulaJSON) {
  const isContinuous = compoundingFrequencyPerYear === null;

  let compoundingFrequencyTitle = 'Compounding frequency per year';
  if (isContinuous) {
    compoundingFrequencyTitle += ' (continuous)';
  }

  return (
    <div>
      <FormElementComponent title="Principal sum">
        <AmountComponent
          {...principalSum}
          setAmount={newPrincipalSum => {
            setFormula(
              LumpSumFormula.fromJSON({
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
          setValue={newNominalAnnualInterestRate => {
            setFormula(
              LumpSumFormula.fromJSON({
                compoundingFrequencyPerYear,
                nominalAnnualInterestRate: newNominalAnnualInterestRate,
                principalSum,
              }),
            );
          }}
          step={0.001}
          value={nominalAnnualInterestRate}
        />
      </FormElementComponent>
      <FormElementComponent title={compoundingFrequencyTitle}>
        <NumberComponent
          setValue={newCompoundingFrequencyPerYear => {
            const value = newCompoundingFrequencyPerYear || null;
            setFormula(
              LumpSumFormula.fromJSON({
                compoundingFrequencyPerYear: value,
                nominalAnnualInterestRate,
                principalSum,
              }),
            );
          }}
          min={0}
          step={1}
          value={compoundingFrequencyPerYear || 0}
        />
      </FormElementComponent>
    </div>
  );
}

import * as React from 'react';

import {
  CompoundingEffectFormula,
  CompoundingEffectFormulaJSON,
} from '../../../timeline';
import NumberComponent from '../../components/Number.component';
import FormElementComponent from '../../components/FormElement.component';
import { EffectFormulaProps } from './props';

export default function CompoundingComponent({
  compoundingFrequencyPerPeriod,
  nominalAnnualInterestRate,
  periodsPerYear,
  setFormula,
}: EffectFormulaProps & CompoundingEffectFormulaJSON) {
  const formulaProps = {
    compoundingFrequencyPerPeriod,
    nominalAnnualInterestRate,
    periodsPerYear,
  };

  return (
    <>
      <FormElementComponent title="Periods per year">
        <NumberComponent
          min={1}
          setValue={(value) =>
            setFormula(
              CompoundingEffectFormula.fromJSON({
                ...formulaProps,
                periodsPerYear: value,
              }),
            )
          }
          step={1}
          value={periodsPerYear}
        />
      </FormElementComponent>
      <FormElementComponent title="Frequency per period">
        <NumberComponent
          min={0}
          setValue={(value) =>
            setFormula(
              CompoundingEffectFormula.fromJSON({
                ...formulaProps,
                compoundingFrequencyPerPeriod: value || null,
              }),
            )
          }
          step={1}
          value={compoundingFrequencyPerPeriod || 0}
        />
      </FormElementComponent>
      <FormElementComponent title="Annual interest (%)">
        <NumberComponent
          setValue={(value) =>
            setFormula(
              CompoundingEffectFormula.fromJSON({
                ...formulaProps,
                nominalAnnualInterestRate: value / 100,
              }),
            )
          }
          step={0.01}
          value={Math.round(nominalAnnualInterestRate * 10000) / 100}
        />
      </FormElementComponent>
    </>
  );
}

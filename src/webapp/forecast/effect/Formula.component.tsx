import * as React from 'react';

import { EffectFormulaType } from '../../../timeline';
import CompoundingComponent from './Compounding.component';
import { SetEffectFormulaFn } from './props';

type Props = {
  formula: any;
  formulaType: EffectFormulaType;
  setFormula: SetEffectFormulaFn;
};

export default function FormulaComponent({
  formula,
  formulaType,
  setFormula,
}: Props) {
  const props = {
    ...formula,
    setFormula,
  };

  switch (formulaType) {
    case EffectFormulaType.Compounding:
      return <CompoundingComponent {...props} />;
    default:
      return <div>Unmapped formulaType {formulaType}</div>;
  }
}

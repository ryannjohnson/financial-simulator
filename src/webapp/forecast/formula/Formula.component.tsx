import * as React from 'react';

import * as timeline from '../../../timeline';
import ContinuousCompoundingInterestComponent from './ContinuousCompoundingInterest.component';
import LumpSumComponent from './LumpSum.component';
import MonthlySumComponent from './MonthlySum.component';
import PeriodicCompoundingInterestComponent from './PeriodicCompoundingInterest.component';
import RecurringSumComponent from './RecurringSum.component';
import { SetFormulaFn } from './props';

type Props = {
  formula: any;
  formulaType: timeline.FormulaType;
  setFormula: SetFormulaFn;
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
    case timeline.FormulaType.ContinuousCompoundingInterest:
      return <ContinuousCompoundingInterestComponent {...props} />;
    case timeline.FormulaType.LumpSum:
      return <LumpSumComponent {...props} />;
    case timeline.FormulaType.MonthlySum:
      return <MonthlySumComponent {...props} />;
    case timeline.FormulaType.PeriodicCompoundingInterest:
      return <PeriodicCompoundingInterestComponent {...props} />;
    case timeline.FormulaType.RecurringSum:
      return <RecurringSumComponent {...props} />;
    default:
      return <div>Unmapped formulaType {formulaType}</div>;
  }
}

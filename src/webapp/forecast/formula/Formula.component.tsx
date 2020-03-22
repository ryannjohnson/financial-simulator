import * as React from 'react';

import * as timeline from '../../../timeline';
import LumpSumComponent from './LumpSum.component';
import MonthlySumComponent from './MonthlySum.component';
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
    case timeline.FormulaType.LumpSum:
      return <LumpSumComponent {...props} />;
    case timeline.FormulaType.MonthlySum:
      return <MonthlySumComponent {...props} />;
    case timeline.FormulaType.RecurringSum:
      return <RecurringSumComponent {...props} />;
    default:
      return <div>Unmapped formulaType {formulaType}</div>;
  }
}

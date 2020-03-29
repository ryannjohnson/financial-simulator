import * as React from 'react';

import { EventFormulaType } from '../../../timeline';
import LumpSumComponent from './LumpSum.component';
import MonthlySumComponent from './MonthlySum.component';
import RecurringSumComponent from './RecurringSum.component';
import { SetEventFormulaFn } from './props';

type Props = {
  formula: any;
  formulaType: EventFormulaType;
  setFormula: SetEventFormulaFn;
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
    case EventFormulaType.LumpSum:
      return <LumpSumComponent {...props} />;
    case EventFormulaType.MonthlySum:
      return <MonthlySumComponent {...props} />;
    case EventFormulaType.RecurringSum:
      return <RecurringSumComponent {...props} />;
    default:
      return <div>Unmapped formulaType {formulaType}</div>;
  }
}

import * as React from 'react';

import * as timeline from '../../../timeline';
import AmountComponent from '../../components/Amount.component';

type SetFormulaFn = (formula: timeline.Formula) => void;

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
  switch (formulaType) {
    case timeline.FormulaType.LumpSum:
      return <LumpSumComponent {...formula} setFormula={setFormula} />;
    default:
      return <div>Unmapped formulaType {formulaType}</div>;
  }
}

type FormulaProps = {
  setFormula: SetFormulaFn;
};

function LumpSumComponent({
  amount,
  setFormula,
}: FormulaProps & timeline.LumpSumFormulaJSON) {
  const setAmountHandler = React.useCallback(
    newAmount => {
      setFormula(new timeline.LumpSumFormula(newAmount));
    },
    [amount],
  );

  return (
    <div>
      <AmountComponent {...amount} setAmount={setAmountHandler} />
    </div>
  );
}

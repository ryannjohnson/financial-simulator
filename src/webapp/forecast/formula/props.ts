import * as timeline from '../../../timeline';

export type SetFormulaFn = (formula: timeline.Formula) => void;

export type FormulaProps = {
  setFormula: SetFormulaFn;
};

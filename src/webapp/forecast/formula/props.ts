import * as timeline from '../../../timeline';

export type SetEventFormulaFn = (formula: timeline.EventFormula) => void;

export type EventFormulaProps = {
  setFormula: SetEventFormulaFn;
};

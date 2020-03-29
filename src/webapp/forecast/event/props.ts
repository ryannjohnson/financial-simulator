import { EventFormula } from '../../../timeline';

export type SetEventFormulaFn = (formula: EventFormula) => void;

export type EventFormulaProps = {
  setFormula: SetEventFormulaFn;
};

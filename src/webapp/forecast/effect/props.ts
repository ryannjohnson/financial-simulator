import { EffectFormula } from '../../../timeline';

export type SetEffectFormulaFn = (formula: EffectFormula) => void;

export type EffectFormulaProps = {
  setFormula: SetEffectFormulaFn;
};

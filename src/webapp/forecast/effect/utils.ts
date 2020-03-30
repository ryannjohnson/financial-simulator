import {
  CompoundingEffectFormula,
  Effect,
  EffectFormula,
  EffectFormulaType,
} from '../../../timeline';
import { generateLocalUUID } from '../../../utils';

export function newEffect(formulaType: EffectFormulaType) {
  let formula: EffectFormula;

  if (formulaType === EffectFormulaType.Compounding) {
    formula = new CompoundingEffectFormula(0, 0);
  } else {
    throw new Error(`FormulaType "${formulaType}" has not been implemented`);
  }

  const id = generateLocalUUID();
  const name = '';
  const startsOn = null;
  const endsOn = null;

  return new Effect(id, formula, startsOn, endsOn, name);
}

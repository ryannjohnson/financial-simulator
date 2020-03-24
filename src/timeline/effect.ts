import { CalendarDate, CalendarDateJSON } from '../calendar-date';
import { stringFromJSON } from '../utils';
import { CompoundingEffectFormula } from './effect-formula/compounding';
import { EffectFormula, EffectFormulaType } from './effect-formula/formula';

export type EffectJSON = {
  endsOn: CalendarDateJSON | null;
  formula: any;
  formulaType: EffectFormulaType;
  name: string;
  startsOn: CalendarDateJSON | null;
};

export class Effect {
  public static fromJSON(value: EffectJSON): Effect {
    const formula = toFormula(value.formulaType, value.formula);
    const startsOn = value.startsOn
      ? CalendarDate.fromJSON(value.startsOn)
      : null;
    const endsOn = value.endsOn ? CalendarDate.fromJSON(value.endsOn) : null;
    const name = stringFromJSON(value.name);
    return new Effect(formula, startsOn, endsOn, name);
  }

  constructor(
    public formula: EffectFormula,
    public startsOn: CalendarDate | null,
    public endsOn: CalendarDate | null,
    public name: string,
  ) {}

  public toJSON(): EffectJSON {
    return {
      endsOn: this.endsOn ? this.endsOn.toJSON() : null,
      formula: this.formula.toJSON(),
      formulaType: this.formula.getType(),
      name: this.name,
      startsOn: this.startsOn ? this.startsOn.toJSON() : null,
    };
  }
}

function toFormula(
  formulaType: EffectFormulaType,
  formula: any,
): EffectFormula {
  switch (formulaType) {
    case EffectFormulaType.Compounding:
      return CompoundingEffectFormula.fromJSON(formula);
    default:
      throw new Error(
        `FormulaType "${formulaType}" hasn't been implemented yet`,
      );
  }
}

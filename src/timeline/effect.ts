import { CalendarDate, CalendarDateJSON } from '../calendar-date';
import { stringFromJSON } from '../utils';
import { CompoundingEffectFormula } from './effect/compounding';
import { EffectFormula, EffectFormulaType } from './effect/formula';

export type EffectJSON = {
  endsOn: CalendarDateJSON | null;
  formula: any;
  formulaType: EffectFormulaType;
  id: string;
  name: string;
  startsOn: CalendarDateJSON | null;
};

export class Effect {
  public static fromJSON(value: EffectJSON): Effect {
    const id = stringFromJSON(value.id);
    const formula = toFormula(value.formulaType, value.formula);
    const startsOn = value.startsOn
      ? CalendarDate.fromJSON(value.startsOn)
      : null;
    const endsOn = value.endsOn ? CalendarDate.fromJSON(value.endsOn) : null;
    const name = stringFromJSON(value.name);
    return new Effect(id, formula, startsOn, endsOn, name);
  }

  constructor(
    public readonly id: string,
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
      id: this.id,
      name: this.name,
      startsOn: this.startsOn ? this.startsOn.toJSON() : null,
    };
  }

  public yieldsValueOnDay(
    balanceValue: number,
    day: number,
    startsOn: CalendarDate,
  ): number {
    if (!this.startsOn) {
      if (!this.endsOn) {
        return this.formula.yieldsValueOnDay(balanceValue, day, startsOn);
      }

      if (startsOn.addDays(day).daysBefore(this.endsOn) > -1) {
        return this.formula.yieldsValueOnDay(balanceValue, day, startsOn);
      }

      return 0;
    }

    if (!this.endsOn) {
      if (startsOn.addDays(day).daysAfter(this.startsOn) > -1) {
        return this.formula.yieldsValueOnDay(balanceValue, day, startsOn);
      }

      return 0;
    }

    const today = startsOn.addDays(day);
    if (
      today.daysAfter(this.startsOn) > -1 &&
      today.daysBefore(this.endsOn) > -1
    ) {
      return this.formula.yieldsValueOnDay(balanceValue, day, startsOn);
    }

    return 0;
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

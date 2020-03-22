import { CalendarDate, CalendarDateJSON } from '../calendar-date';
import { ContinuousCompoundingInterestFormula } from './formula/continuous-compounding-interest';
import { Formula, FormulaType } from './formula/formula';
import { LumpSumFormula } from './formula/lump-sum';
import { MonthlySumFormula } from './formula/monthly-sum';
import { PeriodicCompoundingInterestFormula } from './formula/periodic-compounding-interest';
import { RecurringSumFormula } from './formula/recurring-sum';

export type EventJSON = {
  endsOn: CalendarDateJSON | null;
  formula: any;
  formulaType: FormulaType;
  startsOn: CalendarDateJSON;
};

export class Event {
  public static fromJSON(value: EventJSON): Event {
    const formula = toFormula(value.formulaType, value.formula);
    const startsOn = CalendarDate.fromJSON(value.startsOn);
    const endsOn = value.endsOn ? CalendarDate.fromJSON(value.endsOn) : null;
    return new Event(formula, startsOn, endsOn);
  }

  protected endsAfterDays = 0;

  constructor(
    public formula: Formula,
    protected startsOn: CalendarDate,
    protected endsOn: CalendarDate | null,
  ) {
    this.setDateRange(startsOn, endsOn);
  }

  public *yieldBalanceValues(
    startsOn: CalendarDate,
    days: number,
  ): Generator<number> {
    let balanceValue = 0;

    const daysLate = this.startsOn.daysBefore(startsOn);
    const emptyDays = daysLate * -1;
    const daysToYield = Math.max(days, days + daysLate);

    for (let i = 0; i < emptyDays; i++) {
      yield balanceValue;
    }

    for (let day = 0; day < daysToYield; day++) {
      balanceValue += this.yieldsValueOnDay(day);

      if (day >= daysLate) {
        yield balanceValue;
      }
    }
  }

  public getDateRange(): [CalendarDate, CalendarDate | null] {
    return [this.startsOn, this.endsOn];
  }

  public setDateRange(startsOn: CalendarDate, endsOn: CalendarDate | null) {
    this.startsOn = startsOn;
    this.endsOn = endsOn;
    this.endsAfterDays = endsOn
      ? startsOn.daysBefore(endsOn)
      : Number.MAX_SAFE_INTEGER;
  }

  public toJSON(): EventJSON {
    return {
      endsOn: this.endsOn ? this.endsOn.toJSON() : null,
      formula: this.formula.toJSON(),
      formulaType: this.formula.getType(),
      startsOn: this.startsOn.toJSON(),
    };
  }

  public yieldsValueOnDay(day: number): number {
    if (day < 0) {
      return 0;
    }

    if (this.endsAfterDays < day) {
      return 0;
    }

    return this.formula.yieldsValueOnDay(day, this.startsOn);
  }
}

function toFormula(formulaType: FormulaType, formula: any): Formula {
  switch (formulaType) {
    case FormulaType.ContinuousCompoundingInterest:
      return ContinuousCompoundingInterestFormula.fromJSON(formula);
    case FormulaType.LumpSum:
      return LumpSumFormula.fromJSON(formula);
    case FormulaType.MonthlySum:
      return MonthlySumFormula.fromJSON(formula);
    case FormulaType.PeriodicCompoundingInterest:
      return PeriodicCompoundingInterestFormula.fromJSON(formula);
    case FormulaType.RecurringSum:
      return RecurringSumFormula.fromJSON(formula);
    default:
      throw new Error(
        `FormulaType "${formulaType}" hasn't been implemented yet`,
      );
  }
}

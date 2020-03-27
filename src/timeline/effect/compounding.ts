import { CalendarDate, DAYS_PER_YEAR } from '../../calendar-date';
import { numberFromJSON } from '../../utils';
import { EffectFormula, EffectFormulaType } from './formula';

const DAYS_PER_YEAR_RECIPROCAL = 1 / DAYS_PER_YEAR;

export type CompoundingEffectFormulaJSON = {
  compoundingFrequencyPerYear: number | null;
  nominalAnnualInterestRate: number;
};

/**
 * Cash received and existing over time.
 */
export class CompoundingEffectFormula implements EffectFormula {
  public static fromJSON(
    value: CompoundingEffectFormulaJSON,
  ): CompoundingEffectFormula {
    const nominalAnnualInterestRate = numberFromJSON(
      value.nominalAnnualInterestRate,
    );
    let compoundingFrequencyPerYear = null;
    if (value.compoundingFrequencyPerYear !== null) {
      compoundingFrequencyPerYear = numberFromJSON(
        value.compoundingFrequencyPerYear,
      );
    }
    return new CompoundingEffectFormula(
      nominalAnnualInterestRate,
      compoundingFrequencyPerYear,
    );
  }

  protected readonly daysPerPeriod: number;
  protected readonly increment: number;

  constructor(
    public readonly nominalAnnualInterestRate: number, // 1.0 = 100% annual interest.
    public readonly compoundingFrequencyPerYear: number | null, // Null means continuous.
  ) {
    if (compoundingFrequencyPerYear === null) {
      this.daysPerPeriod = 0;
      this.increment =
        totalContinuousAccumulation(
          nominalAnnualInterestRate,
          DAYS_PER_YEAR_RECIPROCAL,
        ) - 1;
    } else {
      this.daysPerPeriod = DAYS_PER_YEAR / compoundingFrequencyPerYear;
      this.increment =
        totalPeriodicAccumulation(
          nominalAnnualInterestRate,
          compoundingFrequencyPerYear,
          1 / compoundingFrequencyPerYear,
        ) - 1;
    }
  }

  public getType(): EffectFormulaType {
    return EffectFormulaType.Compounding;
  }

  public toJSON(): CompoundingEffectFormulaJSON {
    return {
      compoundingFrequencyPerYear: this.compoundingFrequencyPerYear,
      nominalAnnualInterestRate: this.nominalAnnualInterestRate,
    };
  }

  /**
   * https://en.wikipedia.org/wiki/Compound_interest#Periodic_compounding
   */
  public yieldsValueOnDay(
    balanceValue: number,
    day: number,
    _: CalendarDate,
  ): number {
    if (this.compoundingFrequencyPerYear === null) {
      return balanceValue * this.increment;
    }

    const isInterestDay = day > 0 && day % this.daysPerPeriod < 1;
    if (isInterestDay) {
      return balanceValue * this.increment;
    }

    return 0;
  }
}

const E = 2.718281828459045;

/**
 * @param r is the nominal annual interest rate.
 * @param t is the overall length of time the interest is applied
 *     (expressed using the same time units as r, usually years).
 */
function totalContinuousAccumulation(r: number, t: number): number {
  return Math.pow(E, r * t);
}

/**
 * @param r is the nominal annual interest rate.
 * @param n is the compounding frequency.
 * @param t is the overall length of time the interest is applied
 *     (expressed using the same time units as r, usually years).
 */
function totalPeriodicAccumulation(r: number, n: number, t: number): number {
  return Math.pow(1 + r / n, n * t);
}

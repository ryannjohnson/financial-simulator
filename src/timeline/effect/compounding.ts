import { CalendarDate, DAYS_PER_YEAR } from '../../calendar-date';
import { numberFromJSON } from '../../utils';
import { EffectFormula, EffectFormulaType } from './formula';

export type CompoundingEffectFormulaJSON = {
  compoundingFrequencyPerPeriod: number | null;
  nominalAnnualInterestRate: number;
  periodsPerYear: number;
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
    let compoundingFrequencyPerPeriod = null;
    if (value.compoundingFrequencyPerPeriod !== null) {
      compoundingFrequencyPerPeriod = numberFromJSON(
        value.compoundingFrequencyPerPeriod,
      );
    }
    const periodsPerYear = numberFromJSON(value.periodsPerYear);
    return new CompoundingEffectFormula(
      nominalAnnualInterestRate,
      compoundingFrequencyPerPeriod,
      periodsPerYear,
    );
  }

  protected readonly daysPerCompound: number;
  protected readonly increment: number;

  constructor(
    public readonly nominalAnnualInterestRate: number, // 1.0 = 100% annual interest.
    public readonly compoundingFrequencyPerPeriod: number | null, // Null means continuous.
    public readonly periodsPerYear: number,
  ) {
    if (
      compoundingFrequencyPerPeriod !== null &&
      (!Number.isInteger(compoundingFrequencyPerPeriod) ||
        compoundingFrequencyPerPeriod < 1)
    ) {
      throw new Error(
        `compoundingFrequencyPerYear must be null or a positive integer`,
      );
    }
    const daysPerPeriod = DAYS_PER_YEAR / periodsPerYear;
    if (compoundingFrequencyPerPeriod === null) {
      this.daysPerCompound = 0;
      this.increment =
        totalContinuousAccumulation(
          nominalAnnualInterestRate,
          1 / daysPerPeriod,
        ) - 1;
    } else {
      this.daysPerCompound = daysPerPeriod / compoundingFrequencyPerPeriod;
      this.increment =
        totalPeriodicAccumulation(
          nominalAnnualInterestRate,
          compoundingFrequencyPerPeriod,
          1 / compoundingFrequencyPerPeriod,
        ) - 1;
    }
  }

  public getType(): EffectFormulaType {
    return EffectFormulaType.Compounding;
  }

  public toJSON(): CompoundingEffectFormulaJSON {
    return {
      compoundingFrequencyPerPeriod: this.compoundingFrequencyPerPeriod,
      nominalAnnualInterestRate: this.nominalAnnualInterestRate,
      periodsPerYear: this.periodsPerYear,
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
    if (this.compoundingFrequencyPerPeriod === null) {
      return balanceValue * this.increment;
    }

    const isInterestDay = day > 0 && day % this.daysPerCompound < 1;
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

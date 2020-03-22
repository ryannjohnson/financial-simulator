import { Amount, AmountJSON, Currency } from '../../amount';
import { DAYS_PER_YEAR } from '../../calendar-date';
import { numberFromJSON } from '../../utils';
import { Formula, FormulaType } from './formula';

export type LumpSumFormulaJSON = {
  compoundingFrequencyPerYear: number | null;
  nominalAnnualInterestRate: number;
  principalSum: AmountJSON;
};

/**
 * Cash received and existing over time.
 */
export class LumpSumFormula implements Formula {
  public static fromJSON(value: LumpSumFormulaJSON): LumpSumFormula {
    const principalSum = Amount.fromJSON(value.principalSum);
    const nominalAnnualInterestRate = numberFromJSON(
      value.nominalAnnualInterestRate,
    );
    let compoundingFrequencyPerYear = null;
    if (value.compoundingFrequencyPerYear !== null) {
      compoundingFrequencyPerYear = numberFromJSON(
        value.compoundingFrequencyPerYear,
      );
    }
    return new LumpSumFormula(
      principalSum,
      nominalAnnualInterestRate,
      compoundingFrequencyPerYear,
    );
  }

  public readonly daysPerPeriod: number | null;

  constructor(
    public readonly principalSum: Amount,
    public readonly nominalAnnualInterestRate: number, // 1.0 = 100% annual interest.
    public readonly compoundingFrequencyPerYear: number | null, // Null means continuous.
  ) {
    if (compoundingFrequencyPerYear === null) {
      this.daysPerPeriod = null;
    } else {
      this.daysPerPeriod = DAYS_PER_YEAR / compoundingFrequencyPerYear;
    }
  }

  public getCurrency(): Currency {
    return this.principalSum.currency;
  }

  public getType(): FormulaType {
    return FormulaType.LumpSum;
  }

  public toJSON(): LumpSumFormulaJSON {
    return {
      compoundingFrequencyPerYear: this.compoundingFrequencyPerYear,
      nominalAnnualInterestRate: this.nominalAnnualInterestRate,
      principalSum: this.principalSum.toJSON(),
    };
  }

  /**
   * https://en.wikipedia.org/wiki/Compound_interest#Periodic_compounding
   */
  public yieldsValueOnDay(day: number): number {
    if (day === 0) {
      return this.principalSum.value;
    }

    if (this.compoundingFrequencyPerYear === null) {
      const nextAccumulation = totalContinuousAccumulation(
        this.nominalAnnualInterestRate,
        day / DAYS_PER_YEAR,
      );

      const previousAccumulation = totalContinuousAccumulation(
        this.nominalAnnualInterestRate,
        (day - 1) / DAYS_PER_YEAR,
      );

      const incrementalAccumulation = nextAccumulation - previousAccumulation;

      // TODO: This is expressed as a daily compound. Is the margin of
      // error significant?
      const incrementalValue = Math.floor(
        this.principalSum.value * incrementalAccumulation,
      );

      return incrementalValue;
    }

    const daysPerPeriod = this.daysPerPeriod!;

    const isInterestDay = day > 0 && day % daysPerPeriod < 1;
    if (!isInterestDay) {
      return 0;
    }

    const periodsAccrued = Math.floor(day / daysPerPeriod);

    const nextAccumulation = totalPeriodicAccumulation(
      this.nominalAnnualInterestRate,
      this.compoundingFrequencyPerYear,
      periodsAccrued / this.compoundingFrequencyPerYear,
    );

    const previousAccumulation = totalPeriodicAccumulation(
      this.nominalAnnualInterestRate,
      this.compoundingFrequencyPerYear,
      (periodsAccrued - 1) / this.compoundingFrequencyPerYear,
    );

    const incrementalAccumulation = nextAccumulation - previousAccumulation;

    // TODO: Is this rounding correct?
    const incrementedValue = Math.floor(
      this.principalSum.value * incrementalAccumulation,
    );

    return incrementedValue;
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

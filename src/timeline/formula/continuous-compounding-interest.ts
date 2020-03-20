import { Amount, AmountJSON, Currency } from '../../amount';
import { DAYS_PER_YEAR } from '../../calendar-date';
import { numberFromJSON } from '../../utils';
import { Formula, FormulaType } from './formula';

const E = 2.718281828459045;

export type ContinuousCompoundingInterestFormulaJSON = {
  nominalAnnualInterestRate: number;
  principalSum: AmountJSON;
};

/**
 * Cash invested in a financial vehicle that accrues interest over time.
 */
export class ContinuousCompoundingInterestFormula implements Formula {
  public static fromJSON(
    value: ContinuousCompoundingInterestFormulaJSON,
  ): ContinuousCompoundingInterestFormula {
    const principalSum = Amount.fromJSON(value.principalSum);
    const nominalAnnualInterestRate = numberFromJSON(
      value.nominalAnnualInterestRate,
    );
    return new ContinuousCompoundingInterestFormula(
      principalSum,
      nominalAnnualInterestRate,
    );
  }

  constructor(
    public readonly principalSum: Amount,
    public readonly nominalAnnualInterestRate: number, // 1.0 = 100% annual interest.
  ) {}

  public getCurrency(): Currency {
    return this.principalSum.currency;
  }

  public getType(): FormulaType {
    return FormulaType.ContinuousCompoundingInterest;
  }

  public toJSON(): ContinuousCompoundingInterestFormulaJSON {
    return {
      nominalAnnualInterestRate: this.nominalAnnualInterestRate,
      principalSum: this.principalSum.toJSON(),
    };
  }

  /**
   * https://en.wikipedia.org/wiki/Compound_interest#Continuous_compounding
   */
  public yieldsValueOnDay(day: number): number {
    if (day === 0) {
      return 0;
    }

    const nextAccumulation = totalAccumulation(
      this.nominalAnnualInterestRate,
      day / DAYS_PER_YEAR,
    );

    let previousAccumulation = 0;

    if (day > 1) {
      previousAccumulation = totalAccumulation(
        this.nominalAnnualInterestRate,
        (day - 1) / DAYS_PER_YEAR,
      );
    }

    const incrementalAccumulation = nextAccumulation - previousAccumulation;

    // TODO: This is expressed as a daily compound. Is the margin of
    // error significant?
    const incrementalValue = Math.floor(
      this.principalSum.value * incrementalAccumulation,
    );

    return incrementalValue;
  }
}

/**
 * @param r is the nominal annual interest rate.
 * @param t is the overall length of time the interest is applied
 *     (expressed using the same time units as r, usually years).
 */
function totalAccumulation(r: number, t: number): number {
  return Math.pow(E, r * t);
}

import { Amount, AmountJSON, Currency } from '../../amount';
import { Formula, FormulaType } from './formula';

export type LumpSumFormulaJSON = {
  amount: AmountJSON;
};

/**
 * Cash received.
 */
export class LumpSumFormula implements Formula {
  public static fromJSON(value: LumpSumFormulaJSON): LumpSumFormula {
    const amount = Amount.fromJSON(value.amount);
    return new LumpSumFormula(amount);
  }

  constructor(public readonly amount: Amount) {}

  public getCurrency(): Currency {
    return this.amount.currency;
  }

  public getType(): FormulaType {
    return FormulaType.LumpSum;
  }

  public toJSON(): LumpSumFormulaJSON {
    return {
      amount: this.amount.toJSON(),
    };
  }

  public yieldsValueOnDay(): number {
    return this.amount.value;
  }
}

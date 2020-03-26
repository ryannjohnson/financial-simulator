import { Amount, AmountJSON, Currency } from '../../amount';
import { EventFormula, EventFormulaType } from './formula';

export type LumpSumFormulaJSON = {
  amount: AmountJSON;
};

/**
 * Cash received and existing over time.
 */
export class LumpSumFormula implements EventFormula {
  public static fromJSON(value: LumpSumFormulaJSON): LumpSumFormula {
    const amount = Amount.fromJSON(value.amount);
    return new LumpSumFormula(amount);
  }

  constructor(public readonly amount: Amount) {}

  public getCurrency(): Currency {
    return this.amount.currency;
  }

  public getType(): EventFormulaType {
    return EventFormulaType.LumpSum;
  }

  public toJSON(): LumpSumFormulaJSON {
    return {
      amount: this.amount.toJSON(),
    };
  }

  public yieldsValueOnDay(day: number): number {
    if (day === 0) {
      return this.amount.value;
    }

    return 0;
  }
}

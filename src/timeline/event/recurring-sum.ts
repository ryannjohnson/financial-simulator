import { Amount, AmountJSON, Currency } from '../../amount';
import { integerFromJSON } from '../../utils';
import { EventFormula, EventFormulaType } from './formula';

export type RecurringSumFormulaJSON = {
  amount: AmountJSON;
  everyXDays: number;
};

/**
 * Cash received in regular intervals.
 */
export class RecurringSumFormula implements EventFormula {
  public static fromJSON(value: RecurringSumFormulaJSON): RecurringSumFormula {
    const amount = Amount.fromJSON(value.amount);
    const everyXDays = integerFromJSON(value.everyXDays);
    return new RecurringSumFormula(amount, everyXDays);
  }

  constructor(
    public readonly amount: Amount,
    public readonly everyXDays: number,
  ) {}

  public getCurrency(): Currency {
    return this.amount.currency;
  }

  public getType(): EventFormulaType {
    return EventFormulaType.RecurringSum;
  }

  public toJSON(): RecurringSumFormulaJSON {
    return {
      amount: this.amount.toJSON(),
      everyXDays: this.everyXDays,
    };
  }

  public yieldsValueOnDay(days: number): number {
    if (days % this.everyXDays === 0) {
      return this.amount.value;
    }

    return 0;
  }
}

import { Amount, Currency } from '../../amount';
import { Formula } from './formula';

/**
 * Cash received in regular intervals.
 */
export class RecurringSumFormula implements Formula {
  constructor(
    public readonly amount: Amount,
    public readonly everyXDays: number,
  ) {}

  public getCurrency(): Currency {
    return this.amount.currency;
  }

  public yieldsOnDay(days: number): Amount {
    if (days % this.everyXDays === 0) {
      return this.amount;
    }

    return Amount.zero(this.amount.currency);
  }
}

import { Amount, Currency } from '../../amount';
import { Formula } from './formula';

/**
 * Cash received.
 */
export class LumpSumFormula implements Formula {
  constructor(public readonly amount: Amount) {}

  public getCurrency(): Currency {
    return this.amount.currency;
  }

  public yieldsOnDay(days: number): Amount {
    if (days === 0) {
      return this.amount;
    }

    return Amount.zero(this.amount.currency);
  }
}

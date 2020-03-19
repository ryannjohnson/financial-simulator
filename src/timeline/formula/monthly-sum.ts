import { Amount, Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';
import { Formula } from './formula';

/**
 * Cash received in regular intervals.
 */
export class MonthlySumFormula implements Formula {
  constructor(public readonly amount: Amount) {}

  public getCurrency(): Currency {
    return this.amount.currency;
  }

  public yieldsOnDay(days: number, startsOn: CalendarDate): Amount {
    const date = startsOn.addDays(days);

    if (startsOn.day < date.day) {
      return Amount.zero(this.amount.currency);
    }

    if (date.day < startsOn.day) {
      const isLastDay = date.addDays(1).month !== date.month;
      if (!isLastDay) {
        return Amount.zero(this.amount.currency);
      }
    }

    return this.amount;
  }
}

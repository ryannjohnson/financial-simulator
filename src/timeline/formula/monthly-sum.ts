import { Amount, AmountJSON, Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';
import { Formula, FormulaType } from './formula';

export type MonthlySumFormulaJSON = {
  amount: AmountJSON;
};

/**
 * Cash received in regular intervals.
 */
export class MonthlySumFormula implements Formula {
  public static fromJSON(value: MonthlySumFormulaJSON): MonthlySumFormula {
    const amount = Amount.fromJSON(value.amount);
    return new MonthlySumFormula(amount);
  }

  constructor(public readonly amount: Amount) {}

  public getCurrency(): Currency {
    return this.amount.currency;
  }

  public getType(): FormulaType {
    return FormulaType.MonthlySum;
  }

  public toJSON(): MonthlySumFormulaJSON {
    return {
      amount: this.amount.toJSON(),
    };
  }

  public yieldsValueOnDay(days: number, startsOn: CalendarDate): number {
    const date = startsOn.addDays(days);

    if (startsOn.day < date.day) {
      return 0;
    }

    if (date.day < startsOn.day) {
      const isLastDay = date.addDays(1).month !== date.month;
      if (!isLastDay) {
        return 0;
      }
    }

    return this.amount.value;
  }
}

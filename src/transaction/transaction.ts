import { isString } from '../utils';
import { Amount, AmountJSON } from '../amount';
import { CalendarDate, CalendarDateJSON } from '../calendar-date';

export type TransactionJSON = {
  amount: AmountJSON;
  date: CalendarDateJSON;
  description: string;
};

export class Transaction {
  public static fromJSON(value: TransactionJSON): Transaction {
    const date = CalendarDate.fromJSON(value.date);
    const amount = Amount.fromJSON(value.amount);
    const { description } = value;
    if (!isString(description)) {
      throw new Error('Transaction description must be a string');
    }

    return new Transaction(date, amount, description);
  }

  constructor(
    public date: CalendarDate,
    public amount: Amount,
    public description: string
  ) {}

  public toJSON(): TransactionJSON {
    return {
      amount: this.amount.toJSON(),
      date: this.date.toJSON(),
      description: this.description,
    };
  }
}

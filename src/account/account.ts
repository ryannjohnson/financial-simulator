import { Amount, AmountJSON } from '../amount';
import { CalendarDate } from '../calendar-date';
import { Transaction, TransactionJSON } from '../transaction';
import { isString } from '../utils';

export type AccountJSON = {
  balance: AmountJSON;
  id: string;
  name: string;
  transactions: TransactionJSON[];
};

export class Account {
  public static fromJSON(value: AccountJSON): Account {
    const balance = Amount.fromJSON(value.balance);
    const transactions = value.transactions.map(Transaction.fromJSON);
    const { id, name } = value;
    if (!isString(id)) {
      throw new Error(`Account id must be a string`);
    }
    if (!isString(name)) {
      throw new Error(`Account name must be a string`);
    }

    return new Account(id, name, balance, transactions);
  }

  public transactions: Transaction[];
  private transactionsByCalendarDate: Map<string, Transaction[]>;

  constructor(
    public id: string,
    public name: string,
    public balance: Amount,
    transactions: Transaction[],
  ) {
    this.transactions = [...transactions].sort(byCalendarDateDesc);

    this.transactionsByCalendarDate = new Map<string, Transaction[]>();

    for (const transaction of this.transactions) {
      if (transaction.amount.currency !== this.balance.currency) {
        throw new Error(
          `Account can only have one currency, found "${this.balance.currency}" and "${transaction.amount.currency}"`,
        );
      }

      const date = transaction.date.toString();

      const existingTransactions = this.transactionsByCalendarDate.get(date);

      if (existingTransactions) {
        const concatted = [...existingTransactions, transaction];
        this.transactionsByCalendarDate.set(date, concatted);
      } else {
        this.transactionsByCalendarDate.set(date, [transaction]);
      }
    }
  }

  public getTransactionsByCalendarDate(date: CalendarDate): Transaction[] {
    const dateString = date.toString();

    const transactions = this.transactionsByCalendarDate.get(dateString);

    return transactions ? transactions : [];
  }

  public toJSON(): AccountJSON {
    return {
      balance: this.balance.toJSON(),
      id: this.id,
      name: this.name,
      transactions: this.transactions.map(t => t.toJSON()),
    };
  }
}

function byCalendarDateDesc(a: Transaction, b: Transaction): number {
  let output = 0;

  output = b.date.compare(a.date);
  if (output !== 0) {
    return output;
  }

  output = a.description.localeCompare(b.description);
  if (output !== 0) {
    return output;
  }

  return b.amount.value - a.amount.value;
}

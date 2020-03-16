import { Amount } from '../amount';
import { CalendarDate } from '../calendar-date';
import { Transaction } from '../transaction';

export class Account {
  public transactions: Transaction[];
  private transactionsByCalendarDate: Map<string, Transaction[]>;

  constructor(public balance: Amount, transactions: Transaction[]) {
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

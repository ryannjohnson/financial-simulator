import { Account } from '../account';
import { Amount, Currency } from '../amount';
import { CalendarDate } from '../calendar-date';

type TrailingBalancePoint = {
  balance: Amount;
  date: CalendarDate;
};

/**
 * Ordered chronologically.
 */
export function getMonthlyTrailingBalance(
  account: Account,
): TrailingBalancePoint[] {
  let points: TrailingBalancePoint[] = [];

  let balance = account.balance;

  for (const period of account.getTransactionsByCalendarMonthReversed()) {
    const { month, transactions, year } = period;

    const point = {
      balance,
      date: new CalendarDate(year, month, 1),
    };

    points = [point, ...points];

    const amount = sum(
      account.balance.currency,
      transactions.map(t => t.amount),
    );
    balance = balance.subtract(amount);
  }

  return points;
}

function sum(currency: Currency, amounts: Amount[]): Amount {
  let sum = new Amount(currency, 0);

  for (const amount of amounts) {
    sum = sum.add(amount);
  }

  return sum;
}

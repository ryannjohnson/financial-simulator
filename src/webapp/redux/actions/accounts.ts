import { Amount } from '../../../amount';
import { Transaction } from '../../../transaction';
import * as types from '../types';

export function add(): types.accounts.Add {
  return { type: types.accounts.ADD };
}

export function replaceTransactionsForDateRange(
  id: string,
  transactions: Transaction[],
): types.accounts.ReplaceTransactionsForDateRange {
  if (transactions.length === 0) {
    throw new Error('Transactions count cannot be zero');
  }

  return {
    type: types.accounts.REPLACE_TRANSACTIONS_FOR_DATE_RANGE,
    id,
    transactions: transactions.map(t => t.toJSON()),
  };
}

export function setBalance(
  id: string,
  balance: Amount,
): types.accounts.SetBalance {
  return {
    type: types.accounts.SET_BALANCE,
    id,
    balance: balance.toJSON(),
  };
}

export function setName(id: string, name: string): types.accounts.SetName {
  return {
    type: types.accounts.SET_NAME,
    id,
    name,
  };
}

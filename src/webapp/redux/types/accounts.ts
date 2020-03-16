import { AmountJSON } from '../../../amount';
import { TransactionJSON } from '../../../transaction';

export const ADD = 'ACCOUNTS_ADD';
export const REPLACE_TRANSACTIONS_FOR_DATE_RANGE =
  'REPLACE_TRANSACTIONS_FOR_DATE_RANGE';
export const SET_BALANCE = 'ACCOUNTS_SET_BALANCE';
export const SET_NAME = 'ACCOUNTS_SET_NAME';

export interface Add {
  type: typeof ADD;
}

export interface ReplaceTransactionsForDateRange {
  type: typeof REPLACE_TRANSACTIONS_FOR_DATE_RANGE;
  id: string;
  transactions: TransactionJSON[];
}

export interface SetBalance {
  type: typeof SET_BALANCE;
  id: string;
  balance: AmountJSON;
}

export interface SetName {
  type: typeof SET_NAME;
  id: string;
  name: string;
}

export type Action =
  | Add
  | ReplaceTransactionsForDateRange
  | SetBalance
  | SetName;

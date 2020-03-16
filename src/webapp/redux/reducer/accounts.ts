import { Account, AccountJSON } from '../../../account';
import { Amount, Currency } from '../../../amount';
import { TransactionJSON } from '../../../transaction';
import { generateLocalUUID } from '../../../utils';
import * as types from '../types';

type AccountsState = {
  defaultCurrency: Currency;
  items: AccountJSON[];
};

export function reducer(
  state: AccountsState = initialState,
  action: types.accounts.Action,
): AccountsState {
  if (action.type === types.accounts.ADD) {
    const amount = new Amount(state.defaultCurrency, 0);
    const id = generateLocalUUID();
    const name = 'Untitled';
    const newAccount = new Account(id, name, amount, []).toJSON();
    return {
      ...state,
      items: [...state.items, newAccount],
    };
  }

  if (action.type === types.accounts.REPLACE_TRANSACTIONS_FOR_DATE_RANGE) {
    let minDate = action.transactions[0].date;
    let maxDate = action.transactions[0].date;
    for (const transaction of action.transactions) {
      if (transaction.date.localeCompare(minDate) === -1) {
        minDate = transaction.date;
      }

      if (transaction.date.localeCompare(maxDate) === 1) {
        maxDate = transaction.date;
      }
    }

    const isBeforeOrAfter = (transaction: TransactionJSON) => {
      const isBefore = transaction.date.localeCompare(minDate) === -1;
      const isAfter = transaction.date.localeCompare(maxDate) === 1;
      return isBefore || isAfter;
    };

    return {
      ...state,
      items: updateOneByID(state.items, action.id, item => {
        return {
          ...item,
          transactions: item.transactions
            .filter(isBeforeOrAfter)
            .concat(action.transactions),
        };
      }),
    };
  }

  if (action.type === types.accounts.SET_BALANCE) {
    return {
      ...state,
      items: updateOneByID(state.items, action.id, item => {
        return {
          ...item,
          balance: action.balance,
        };
      }),
    };
  }

  if (action.type === types.accounts.SET_NAME) {
    return {
      ...state,
      items: updateOneByID(state.items, action.id, item => {
        return {
          ...item,
          name: action.name,
        };
      }),
    };
  }

  return state;
}

interface HasID {
  id: string;
}

/**
 * Callback should non-destructively return the replacement item.
 */
function updateOneByID<T extends HasID>(
  items: T[],
  id: string,
  callback: (item: T) => T,
): T[] {
  let newItems: T[] = [];

  let found = false;

  for (const item of items) {
    if (item.id !== id) {
      newItems = [...newItems, item];
      continue;
    }

    if (found) {
      throw new Error(`Found duplicate id "${id}"`);
    }

    found = true;

    newItems = [...newItems, callback(item)];
  }

  if (!found) {
    throw new Error(`Found no item by id "${id}"`);
  }

  return newItems;
}

const initialState = {
  defaultCurrency: Currency.USD,
  items: [],
};

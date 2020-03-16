import * as React from 'react';

import { AccountJSON } from '../../account';
import { Amount } from '../../amount';
import * as actions from '../redux/actions';

export type Props = {
  accounts: AccountJSON[];
  addAccount: typeof actions.accounts.add;
};

export default function AccountsComponent({ accounts, addAccount }: Props) {
  return (
    <div>
      <div>
        {accounts.map(account => (
          <div key={account.id}>
            {account.name}: {Amount.fromJSON(account.balance).toString()},{' '}
            {account.transactions.length} transactions
          </div>
        ))}
      </div>
      <button onClick={addAccount}>+ Add Account</button>
    </div>
  );
}

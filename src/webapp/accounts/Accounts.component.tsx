import * as React from 'react';

import { AccountJSON } from '../../account';
import * as actions from '../redux/actions';
import AccountContainer from './Account.container';

export type Props = {
  accounts: AccountJSON[];
  addAccount: typeof actions.accounts.add;
};

export default function AccountsComponent({ accounts, addAccount }: Props) {
  return (
    <div>
      <table>
        <tbody>
          {accounts.map(account => (
            <AccountContainer key={account.id} {...account} />
          ))}
        </tbody>
      </table>
      <button onClick={addAccount}>+ Add Account</button>
    </div>
  );
}

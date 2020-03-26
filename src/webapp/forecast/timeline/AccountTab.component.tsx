import * as React from 'react';

import * as actions from '../../redux/actions';

type Props = {
  accountId: string;
  isSelected: boolean;
  name: string;
  selectAccount: typeof actions.forecast.selectAccount;
};

export default function AccountTabComponent({
  accountId,
  isSelected,
  name,
  selectAccount,
}: Props) {
  return (
    <button onClick={() => selectAccount(accountId)}>
      {name}
      {isSelected ? '*' : ''}
    </button>
  );
}

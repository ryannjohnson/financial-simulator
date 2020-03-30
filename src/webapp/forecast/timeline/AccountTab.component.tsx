import classnames from 'classnames';
import * as React from 'react';

import * as actions from '../../redux/actions';
import styles from './AccountTab.css';

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
    <button
      className={classnames(styles.button, isSelected && styles.selected)}
      onClick={() => selectAccount(accountId)}
    >
      {name}
    </button>
  );
}

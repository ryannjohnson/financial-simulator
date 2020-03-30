import * as React from 'react';

import { Account } from '../../../timeline';
import { generateLocalUUID } from '../../../utils';
import * as actions from '../../redux/actions';
import AccountTabContainer from './AccountTab.container';
import TimelineContainer from './Timeline.container';
import styles from './TimelineFrame.css';

type Props = {
  accountIds: string[];
  addAccount: typeof actions.forecast.addAccount;
  selectedAccountId: string | null;
};

export default function TimelineFrameComponent({
  accountIds,
  addAccount,
  selectedAccountId,
}: Props) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>&nbsp;</div>
      <div className={styles['timeline-container']}>
        {selectedAccountId && (
          <TimelineContainer accountId={selectedAccountId} />
        )}
      </div>
      <div>
        {accountIds.map(accountId => (
          <AccountTabContainer accountId={accountId} key={accountId} />
        ))}
        <button onClick={() => addAccount(newAccount())}>+ Add</button>
      </div>
    </div>
  );
}

function newAccount() {
  return new Account(generateLocalUUID(), [], 'Untitled');
}

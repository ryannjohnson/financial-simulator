import * as React from 'react';

import { Account } from '../../../timeline';
import { generateLocalUUID } from '../../../utils';
import * as actions from '../../redux/actions';
import AccountTabContainer from './AccountTab.container';
import TimelineContainer from './Timeline.container';

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
    <div style={containerStyle}>
      <div style={timelineContainerStyle}>
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

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100%',
  overflow: 'hidden',
};

const timelineContainerStyle: React.CSSProperties = {
  flexGrow: 1,
  overflowY: 'auto',
  position: 'relative',
};

function newAccount() {
  return new Account(generateLocalUUID(), [], 'Untitled');
}

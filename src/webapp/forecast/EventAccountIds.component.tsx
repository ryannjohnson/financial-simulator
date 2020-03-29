import * as React from 'react';

import { CalendarDateJSON } from '../../calendar-date';
import { AccountJSON } from '../../timeline';
import FormElementComponent from '../components/FormElement.component';
import Row from '../components/Row.component';
import RowItem from '../components/RowItem.component';
import * as actions from '../redux/actions';

type Props = {
  accounts: AccountJSON[];
  eventId: string;
  fromAccountId: CalendarDateJSON | null;
  setEventAccountIds: typeof actions.forecast.setEventAccountIds;
  toAccountId: CalendarDateJSON | null;
};

export default function EventAccountIds({
  accounts,
  eventId,
  setEventAccountIds,
  fromAccountId,
  toAccountId,
}: Props) {
  const dropdownAccounts = [
    nullOption,
    ...accounts.map(a => ({ id: a.id, name: a.name })),
  ];

  return (
    <Row>
      <RowItem>
        <FormElementComponent title="From account">
          <Dropdown
            accounts={dropdownAccounts.filter(anyExcept(toAccountId))}
            accountId={fromAccountId}
            onChange={accountId =>
              setEventAccountIds(eventId, accountId, toAccountId)
            }
          />
        </FormElementComponent>

        <FormElementComponent title="To account">
          <Dropdown
            accounts={dropdownAccounts.filter(anyExcept(fromAccountId))}
            accountId={toAccountId}
            onChange={accountId =>
              setEventAccountIds(eventId, fromAccountId, accountId)
            }
          />
        </FormElementComponent>
      </RowItem>
      <button
        onClick={() => setEventAccountIds(eventId, toAccountId, fromAccountId)}
      >
        Swap
      </button>
    </Row>
  );
}

function anyExcept(otherAccountId: string | null) {
  return (account: DropdownAccount) => {
    if (account.id === null) {
      return otherAccountId !== null;
    }
    return account.id !== otherAccountId;
  };
}

type DropdownProps = {
  accounts: DropdownAccount[];
  accountId: string | null;
  onChange: (accountId: string | null) => void;
};

type DropdownAccount = { id: string | null; name: string };

function Dropdown({ accounts, accountId, onChange }: DropdownProps) {
  const onChangeHandler = (event: React.ChangeEvent<HTMLSelectElement>) => {
    onChange(event.target.value || null);
  };

  return (
    <select onChange={onChangeHandler} value={accountId || ''}>
      {[...accounts].map(account => {
        return (
          <option key={account.id || ''} value={account.id || ''}>
            {account.name}
          </option>
        );
      })}
    </select>
  );
}

const nullOption: DropdownAccount = { id: null, name: '[none]' };

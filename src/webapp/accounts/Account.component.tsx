import * as React from 'react';

import { AccountJSON } from '../../account';
import { Amount } from '../../amount';
import { importString } from '../../transaction/import';
import * as actions from '../redux/actions';

export type Props = AccountJSON & {
  replaceTransactionsForDateRange: typeof actions.accounts.replaceTransactionsForDateRange;
  setBalance: typeof actions.accounts.setBalance;
  setName: typeof actions.accounts.setName;
};

export default function AccountComponent({
  balance,
  id,
  name,
  replaceTransactionsForDateRange,
  setBalance,
  setName,
  transactions,
}: Props) {
  const [processingCount, setProcessingCount] = React.useState(0);

  const onAddTransactions = React.useCallback(event => {
    for (const file of event.target.files) {
      setProcessingCount(count => count + 1);
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const transactions = await importString(reader.result as string);
          replaceTransactionsForDateRange(id, transactions);
        } finally {
          setProcessingCount(count => count - 1);
        }
      };
      reader.readAsText(file);
    }
  }, []);

  const onSetBalance = React.useCallback(event => {
    const amount = new Amount(
      balance.currency,
      parseInt(event.target.value, 10),
    );
    setBalance(id, amount);
  }, []);

  const onSetName = React.useCallback(event => {
    setName(id, event.target.value);
  }, []);

  return (
    <tr>
      <td>
        <input onChange={onSetName} type="text" value={name} />
      </td>
      <td>
        <input
          onChange={onSetBalance}
          step={1}
          type="number"
          value={balance.value}
        />
      </td>
      <td>{Amount.fromJSON(balance).toString()}</td>
      <td>{transactions.length} transactions</td>
      <td>
        <label>
          Add transactions
          <input
            multiple={true}
            onChange={onAddTransactions}
            readOnly={processingCount > 0}
            style={{ visibility: 'hidden' }}
            type="file"
          />
        </label>
      </td>
    </tr>
  );
}

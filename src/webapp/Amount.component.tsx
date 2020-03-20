import * as React from 'react';

import { Amount, AmountJSON } from '../amount';

type Props = AmountJSON & {
  setAmount: (amount: Amount) => void;
};

export default function AmountComponent({ currency, setAmount, value }: Props) {
  const setAmountHandler = React.useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setAmount(
        Amount.fromJSON({ currency, value: parseInt(event.target.value, 10) }),
      );
    },
    [currency, value],
  );

  return <input onChange={setAmountHandler} step={1} value={value} />;
}

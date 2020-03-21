import * as React from 'react';

import { Amount, AmountJSON } from '../../amount';

type Props = AmountJSON & {
  setAmount: (amount: Amount) => void;
};

export default function AmountComponent({ currency, setAmount, value }: Props) {
  return (
    <input
      onChange={event =>
        setAmount(
          Amount.fromJSON({
            currency,
            value: parseInt(event.target.value, 10),
          }),
        )
      }
      step={1}
      value={value}
    />
  );
}

import * as React from 'react';

import { Amount, AmountJSON } from '../../amount';
import styles from './Input.css';

type Props = AmountJSON & {
  setAmount: (amount: Amount) => void;
};

export default function AmountComponent({ currency, setAmount, value }: Props) {
  return (
    <input
      className={styles.input}
      onChange={event =>
        setAmount(
          Amount.fromJSON({
            currency,
            value: parseInt(event.target.value, 10),
          }),
        )
      }
      step={1}
      type="number"
      value={value}
    />
  );
}

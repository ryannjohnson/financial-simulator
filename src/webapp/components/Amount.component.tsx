import * as React from 'react';

import { Amount, AmountJSON } from '../../amount';
import NumberComponent, { Props as NumberProps } from './Number.component';

type Props = Omit<NumberProps, 'setValue' | 'step'> &
  AmountJSON & {
    setAmount: (amount: Amount) => void;
  };

export default function AmountComponent({
  currency,
  setAmount,
  ...props
}: Props) {
  return (
    <NumberComponent
      {...props}
      setValue={value => setAmount(Amount.fromJSON({ currency, value }))}
      step={1}
    />
  );
}

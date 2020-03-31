import * as React from 'react';

import { Amount, AmountJSON, Currency } from '../../amount';
import NumberComponent, { Props as NumberProps } from './Number.component';

type Props = Omit<NumberProps, 'setValue' | 'step'> &
  AmountJSON & {
    setAmount: (amount: Amount) => void;
  };

export default function AmountComponent({
  currency,
  setAmount,
  value,
  ...props
}: Props) {
  let step = 1;

  if (currency === Currency.USD) {
    step = 0.01;
    value = value / 100;
  }

  return (
    <NumberComponent
      {...props}
      setValue={newValue => {
        if (currency === Currency.USD) {
          newValue = Math.round(newValue * 100);
        }
        setAmount(Amount.fromJSON({ currency, value: newValue }));
      }}
      step={step}
      value={value}
    />
  );
}

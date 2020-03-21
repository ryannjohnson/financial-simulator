import * as React from 'react';

type Props = {
  setValue: (value: number) => void;
  step?: number;
  value: number;
};

export default function NumberComponent({ setValue, step, value }: Props) {
  return (
    <input
      onChange={event => setValue(parseInt(event.target.value, 10))}
      step={step}
      type="number"
      value={value}
    />
  );
}

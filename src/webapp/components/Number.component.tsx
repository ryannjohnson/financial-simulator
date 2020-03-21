import * as React from 'react';

type Props = {
  setValue: (value: number) => void;
  step?: number;
  value: number;
};

export default function NumberComponent({ setValue, step, value }: Props) {
  return (
    <input
      onChange={event => {
        let newValue: number;

        if (step && step >= 1) {
          newValue = parseInt(event.target.value, 10);
        } else {
          newValue = parseFloat(event.target.value);
        }

        setValue(newValue);
      }}
      step={step}
      type="number"
      value={value}
    />
  );
}

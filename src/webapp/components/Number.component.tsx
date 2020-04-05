import * as React from 'react';

import styles from './Input.css';

export type Props = {
  min?: number;
  setValue: (value: number) => void;
  step?: number;
  value: number;
};

const numberPattern = /^-?\d+(\.\d+)?$/;

export default function NumberComponent({ min, setValue, step, value }: Props) {
  const [typedValue, setTypedValue] = React.useState(value.toString());

  React.useEffect(() => {
    if (numberPattern.test(typedValue)) {
      if (toNumber(typedValue, step) === value) {
        return;
      }
    }

    setTypedValue(value.toString());
  }, [value]);

  return (
    <input
      className={styles.input}
      min={min}
      onChange={(event) => {
        const { value: targetValue } = event.target;

        setTypedValue(targetValue);

        if (!numberPattern.test(targetValue)) {
          return;
        }

        setValue(toNumber(targetValue, step));
      }}
      step={step}
      type="number"
      value={typedValue}
    />
  );
}

function toNumber(value: string, step: number | undefined): number {
  if (step && step >= 1 && step % 1 === 0) {
    return parseInt(value, 10);
  }
  return parseFloat(value);
}

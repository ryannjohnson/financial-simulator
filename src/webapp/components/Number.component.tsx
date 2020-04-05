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

  React.useEffect(() => setTypedValue(value.toString()), [value]);

  return (
    <input
      className={styles.input}
      min={min}
      onChange={event => {
        const { value: targetValue } = event.target;

        setTypedValue(targetValue);

        if (!numberPattern.test(targetValue)) {
          return;
        }

        let newValue: number;

        if (step && step >= 1 && step % 1 === 0) {
          newValue = parseInt(targetValue, 10);
        } else {
          newValue = parseFloat(targetValue);
        }

        setValue(newValue);
      }}
      step={step}
      type="number"
      value={typedValue}
    />
  );
}

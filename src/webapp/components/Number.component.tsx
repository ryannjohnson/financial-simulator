import * as React from 'react';

import styles from './Input.css';

export type Props = {
  min?: number;
  setValue: (value: number) => void;
  step?: number;
  value: number;
};

export default function NumberComponent({ min, setValue, step, value }: Props) {
  return (
    <input
      className={styles.input}
      min={min}
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

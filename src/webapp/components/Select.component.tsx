import * as React from 'react';

import styles from './Input.css';

type Props<T> = {
  options: SelectOption<T>[];
  setValue: (value: T) => void;
  value: T;
};

type SelectOption<T> = {
  name?: string;
  value: T;
};

export default function SelectComponent<T extends string>({
  options,
  setValue,
  value,
  ...props
}: Props<T>) {
  return (
    <select
      className={styles.input}
      onChange={event => setValue(event.target.value as any)}
      value={value as any}
      {...props}
    >
      {options.map(option => (
        <option key={option.value as any} value={option.value as any}>
          {option.name || option.value}
        </option>
      ))}
    </select>
  );
}

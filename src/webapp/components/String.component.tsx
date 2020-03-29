import * as React from 'react';

import styles from './Input.css';

type Props = {
  setValue: (value: string) => void;
  value: string;
};

export default function StringComponent({ setValue, value }: Props) {
  return (
    <input
      className={styles.input}
      onChange={event => setValue(event.target.value)}
      type="text"
      value={value}
    />
  );
}

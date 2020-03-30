import * as React from 'react';

import styles from './FormElement.css';

type Props = {
  children: React.ReactNode;
  title: string;
};

export default function FormElementComponent({ children, title }: Props) {
  return (
    <tr>
      <td className={styles.title}>{title}</td>
      <td>{children}</td>
    </tr>
  );
}

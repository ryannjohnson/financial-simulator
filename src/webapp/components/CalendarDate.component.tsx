import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';
import * as styles from './CalendarDate.css';
import {
  Props as NullableProps,
} from './NullableCalendarDate.component';

type Props = Omit<NullableProps, 'setValue' | 'value'> & {
  setValue: (value: CalendarDate) => void;
  value: CalendarDateJSON;
};

export default function CalendarDateComponent({
  setValue,
  value,
  ...props
}: Props) {
  return (
    <input
      className={styles.input}
      onChange={event => {
        const date = new Date(event.target.value);
        if (!isNaN(date as any)) {
          setValue(CalendarDate.fromDate(date));
        }
      }}
      type="date"
      value={value}
    />
  );
}

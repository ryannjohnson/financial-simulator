import * as React from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';
import styles from './CalendarDate.css';

type Props = Partial<ReactDatePickerProps> & {
  setValue: (value: CalendarDate) => void;
  value: CalendarDateJSON;
};

export default function CalendarDateComponent({
  setValue,
  value,
  ...props
}: Props) {
  return (
    <DatePicker
      className={styles.input}
      isClearable={false}
      dateFormat="yyyy-MM-dd"
      selected={new Date(value)}
      onChange={date => setValue(CalendarDate.fromDate(date!))}
      {...props}
    />
  );
}

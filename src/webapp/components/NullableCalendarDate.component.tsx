import * as React from 'react';
import DatePicker, { ReactDatePickerProps } from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';
import styles from './CalendarDate.css';

type Props = Partial<Omit<ReactDatePickerProps, 'value'>> & {
  setValue: (value: CalendarDate | null) => void;
  value: CalendarDateJSON | null;
};

export default function NullableCalendarDateComponent({
  setValue,
  value,
  ...props
}: Props) {
  return (
    <DatePicker
      className={styles.input}
      isClearable={true}
      dateFormat="yyyy-MM-dd"
      selected={value ? new Date(value) : null}
      onChange={date => {
        if (date) {
          setValue(CalendarDate.fromDate(date));
        } else {
          setValue(null);
        }
      }}
      {...props}
    />
  );
}

import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';

type Props = {
  setValue: (value: CalendarDate | null) => void;
  value: CalendarDateJSON | null;
};

export default function NullableCalendarDateComponent({
  setValue,
  value,
}: Props) {
  return (
    <DatePicker
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
    />
  );
}

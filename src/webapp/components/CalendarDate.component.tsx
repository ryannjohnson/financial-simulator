import * as React from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';

type Props = {
  setValue: (value: CalendarDate) => void;
  value: CalendarDateJSON;
};

export default function CalendarDateComponent({ setValue, value }: Props) {
  return (
    <DatePicker
      isClearable={false}
      dateFormat="yyyy-MM-dd"
      selected={new Date(value)}
      onChange={date => setValue(CalendarDate.fromDate(date!))}
    />
  );
}

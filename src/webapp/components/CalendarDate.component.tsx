import * as React from 'react';
import 'react-datepicker/dist/react-datepicker.css';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';
import NullableCalendarDateComponent, {
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
    <NullableCalendarDateComponent
      isClearable={false}
      selected={new Date(value)}
      setValue={value => {
        if (!value) {
          throw new Error('CalendarDate cannot be null');
        }
        setValue(value);
      }}
      value={value}
      {...props}
    />
  );
}

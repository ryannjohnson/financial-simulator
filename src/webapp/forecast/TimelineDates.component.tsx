import * as React from 'react';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';
import CalendarDateComponent from '../components/CalendarDate.component';
import * as actions from '../redux/actions';
import styles from './TimelineDates.css';

type Props = {
  endsOn: CalendarDateJSON;
  setDates: typeof actions.forecast.setTimelineCalendarDates;
  startsOn: CalendarDateJSON;
};

export default function TimelineDatesComponent({
  endsOn,
  setDates,
  startsOn,
}: Props) {
  return (
    <div className={styles.container}>
      <CalendarDateComponent
        className={styles['calendar-input']}
        setValue={value => {
          setDates(value, CalendarDate.fromJSON(endsOn));
        }}
        value={startsOn}
      />
      <div className={styles.buffer}>⌚</div>
      <CalendarDateComponent
        className={styles['calendar-input']}
        setValue={value => {
          setDates(CalendarDate.fromJSON(startsOn), value);
        }}
        value={endsOn}
      />
    </div>
  );
}

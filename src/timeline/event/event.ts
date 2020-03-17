import { Amount } from '../../amount';
import { CalendarDate } from '../../calendar-date';

export interface Event {
  /**
   * Change in balance on a given calendar date.
   */
  changeOn(date: CalendarDate): Amount;

  /**
   * The last day that this event is in effect.
   */
  endsOn(): CalendarDate | null;

  /**
   * Allows for accessing an event by its id instead of its index.
   */
  id(): string;

  /**
   * The day that this event goes into effect.
   */
  startsOn(): CalendarDate;
}

import { Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';

export interface Formula {
  getCurrency(): Currency;

  /**
   * The first day of the formula is day zero.
   */
  yieldsValueOnDay(day: number, startsOn: CalendarDate): number;
}

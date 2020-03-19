import { Amount, Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';

export interface Formula {
  getCurrency(): Currency;

  /**
   * The first day of the formula is day zero.
   */
  yieldsOnDay(day: number, startsOn: CalendarDate): Amount;
}

import { Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';

export enum FormulaType {
  LumpSum = 'LUMP_SUM',
  MonthlySum = 'MONTHLY_SUM',
  RecurringSum = 'RECURRING_SUM',
}

export interface Formula {
  getCurrency(): Currency;
  getType(): FormulaType;
  toJSON(): any;

  /**
   * The first day of the formula is day zero.
   */
  yieldsValueOnDay(day: number, startsOn: CalendarDate): number;
}

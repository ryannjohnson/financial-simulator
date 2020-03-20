import { Currency } from '../../amount';
import { CalendarDate } from '../../calendar-date';

export enum FormulaType {
  ContinuousCompoundingInterest = 'CONTINUOUS_COMPOUNDING_INTEREST',
  LumpSum = 'LUMP_SUM',
  MonthlySum = 'MONTHLY_SUM',
  PeriodicCompoundingInterest = 'PERIODIC_COMPOUNDING_INTEREST',
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

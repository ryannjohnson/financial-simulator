import { CalendarDate } from '../../calendar-date';

export enum EffectFormulaType {
  Compounding = 'COMPOUNDING',
}

export interface EffectFormula {
  getType(): EffectFormulaType;
  toJSON(): any;

  /**
   * The first day of the formula is day zero.
   *
   * Because effects accrue in increments with different rules, the
   * output value can be a float and needs to be rounded prior to
   * display.
   */
  yieldsValueOnDay(
    balanceValue: number,
    day: number,
    startsOn: CalendarDate,
  ): number;
}

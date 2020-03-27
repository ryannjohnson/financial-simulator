import {
  CalendarDate,
  CalendarDateJSON,
  rangesOverlap,
} from '../../calendar-date';
import { stringFromJSON } from '../../utils';
import { EventFormula, EventFormulaType } from './formula';
import { LumpSumFormula } from './lump-sum';
import { MonthlySumFormula } from './monthly-sum';
import { RecurringSumFormula } from './recurring-sum';

export type EventJSON = {
  endsOn: CalendarDateJSON | null;
  formula: any;
  formulaType: EventFormulaType;
  fromAccountId: string | null;
  id: string;
  name: string;
  startsOn: CalendarDateJSON;
  toAccountId: string | null;
};

export class Event {
  public static fromJSON(value: EventJSON): Event {
    const id = stringFromJSON(value.id);
    const fromAccountId = value.fromAccountId
      ? stringFromJSON(value.fromAccountId)
      : null;
    const toAccountId = value.toAccountId
      ? stringFromJSON(value.toAccountId)
      : null;
    const formula = toFormula(value.formulaType, value.formula);
    const startsOn = CalendarDate.fromJSON(value.startsOn);
    const endsOn = value.endsOn ? CalendarDate.fromJSON(value.endsOn) : null;
    const name = stringFromJSON(value.name);
    return new Event(
      id,
      fromAccountId,
      toAccountId,
      formula,
      startsOn,
      endsOn,
      name,
    );
  }

  protected endsAfterDays = 0;

  constructor(
    public readonly id: string,
    public fromAccountId: string | null,
    public toAccountId: string | null,
    public formula: EventFormula,
    public startsOn: CalendarDate,
    public endsOn: CalendarDate | null,
    public name: string,
  ) {
    if (fromAccountId && fromAccountId === toAccountId) {
      throw new Error(`Account ids cannot be the same`);
    }
    this.setEndsAfterDays();
  }

  public *yieldBalanceValues(
    startsOn: CalendarDate,
    days: number,
  ): Generator<number> {
    let balanceValue = 0;

    const daysLate = this.startsOn.daysBefore(startsOn);
    const daysToYield = Math.max(days, days + daysLate);

    for (let i = 0; daysLate < i; i--) {
      yield balanceValue;
    }

    for (let day = 0; day < daysToYield; day++) {
      balanceValue += this.yieldsValueOnDay(day);

      if (day >= daysLate) {
        yield balanceValue;
      }
    }
  }

  public getDateRange(): [CalendarDate, CalendarDate | null] {
    return [this.startsOn, this.endsOn];
  }

  public getEndsOn() {
    return this.endsOn;
  }

  public getName() {
    return this.name;
  }

  public getStartsOn() {
    return this.startsOn;
  }

  /**
   * Returns true if both events share at least one day.
   */
  public overlapsWith(event: Event): boolean {
    const [a0, a1] = this.getDateRange();
    const [b0, b1] = event.getDateRange();
    return rangesOverlap(a0, a1, b0, b1);
  }

  public setDateRange(startsOn: CalendarDate, endsOn: CalendarDate | null) {
    this.startsOn = startsOn;
    this.endsOn = endsOn;
    this.setEndsAfterDays();
  }

  public setEndsOn(endsOn: CalendarDate | null) {
    this.endsOn = endsOn;
    this.setEndsAfterDays();
  }

  protected setEndsAfterDays() {
    this.endsAfterDays = this.endsOn
      ? this.startsOn.daysBefore(this.endsOn)
      : Number.MAX_SAFE_INTEGER;
  }

  public setStartsOn(startsOn: CalendarDate) {
    this.startsOn = startsOn;
    this.setEndsAfterDays();
  }

  public toJSON(): EventJSON {
    return {
      endsOn: this.endsOn ? this.endsOn.toJSON() : null,
      formula: this.formula.toJSON(),
      formulaType: this.formula.getType(),
      fromAccountId: this.fromAccountId,
      id: this.id,
      name: this.name,
      startsOn: this.startsOn.toJSON(),
      toAccountId: this.toAccountId,
    };
  }

  public yieldsValueOnDay(day: number): number {
    if (day < 0) {
      return 0;
    }

    if (this.endsAfterDays < day) {
      return 0;
    }

    return this.formula.yieldsValueOnDay(day, this.startsOn);
  }
}

function toFormula(formulaType: EventFormulaType, formula: any): EventFormula {
  switch (formulaType) {
    case EventFormulaType.LumpSum:
      return LumpSumFormula.fromJSON(formula);
    case EventFormulaType.MonthlySum:
      return MonthlySumFormula.fromJSON(formula);
    case EventFormulaType.RecurringSum:
      return RecurringSumFormula.fromJSON(formula);
    default:
      throw new Error(
        `FormulaType "${formulaType}" hasn't been implemented yet`,
      );
  }
}

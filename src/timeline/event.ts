import { CalendarDate } from '../calendar-date';
import { Formula } from './formula/formula';

export class Event {
  protected endsAfterDays = 0;

  constructor(
    public formula: Formula,
    protected startsOn: CalendarDate,
    protected endsOn: CalendarDate | null,
  ) {
    this.setRange(startsOn, endsOn);
  }

  public *yieldBalanceValues(
    startsOn: CalendarDate,
    days: number,
  ): Generator<number> {
    let balanceValue = 0;

    const daysLate = this.startsOn.daysBefore(startsOn);
    const emptyDays = daysLate * -1;
    const daysToYield = Math.max(days, days + daysLate);

    for (let i = 0; i < emptyDays; i++) {
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

  public setRange(startsOn: CalendarDate, endsOn: CalendarDate | null) {
    this.startsOn = startsOn;
    this.endsOn = endsOn;
    this.endsAfterDays = endsOn
      ? startsOn.daysBefore(endsOn)
      : Number.MAX_SAFE_INTEGER;
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

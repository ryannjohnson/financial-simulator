import { Amount } from '../amount';
import { CalendarDate } from '../calendar-date';
import { Formula } from './formula';

export class Event {
  constructor(
    public formula: Formula,
    public startsOn: CalendarDate,
    public endsOn: CalendarDate | null,
  ) {}

  public yieldsOn(date: CalendarDate): Amount {
    const daysElapsed = this.startsOn.daysUntil(date);

    if (daysElapsed < 0) {
      return Amount.zero(this.formula.getCurrency());
    }

    if (this.endsOn && date.daysUntil(this.endsOn) > 0) {
      return Amount.zero(this.formula.getCurrency());
    }

    return this.formula.yieldsOnDay(daysElapsed, this.startsOn);
  }
}

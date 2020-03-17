import { Amount, Currency } from '../amount';
import { CalendarDate } from '../calendar-date';

type DailyBalances = {
  currency: Currency;
  startsOn: CalendarDate;
  values: number[];
};

export interface DailyBalanceEvent {
  getAmountChangedOn(date: CalendarDate): Amount;
  getStartsOn(): CalendarDate;
}

export function getDailyBalances(
  currency: Currency,
  events: DailyBalanceEvent[],
  durationInDays: number,
): DailyBalances {
  if (events.length === 0) {
    return { currency, startsOn: CalendarDate.today(), values: [] };
  }

  let startsOn = events[0].getStartsOn();
  for (const event of events) {
    if (event.getStartsOn().compare(startsOn) === -1) {
      startsOn = event.getStartsOn();
    }
  }

  let balance = new Amount(currency, 0);
  let values: number[] = [];

  for (let i = 0; i < durationInDays; i++) {
    const date = startsOn.addDays(i);
    for (const event of events) {
      balance = balance.add(event.getAmountChangedOn(date));
    }
    values.push(balance.value);
  }

  return { currency, startsOn, values };
}

export class RegularEvent implements DailyBalanceEvent {
  constructor(
    private daysInterval: number,
    private amount: Amount,
    private startsOn: CalendarDate,
    private endsOn?: CalendarDate,
  ) {}

  public getAmountChangedOn(date: CalendarDate): Amount {
    if (this.endsOn && date.daysUntil(this.endsOn) < 0) {
      return Amount.zero(this.amount.currency);
    }

    const daysUntil = this.startsOn.daysUntil(date);

    if (daysUntil < 0) {
      return Amount.zero(this.amount.currency);
    }

    if (daysUntil % this.daysInterval !== 0) {
      return Amount.zero(this.amount.currency);
    }

    return this.amount;
  }

  public getStartsOn(): CalendarDate {
    return this.startsOn;
  }
}

export class MonthlyEvent implements DailyBalanceEvent {
  constructor(
    private amount: Amount,
    private startsOn: CalendarDate,
    private endsOn?: CalendarDate,
  ) {}

  public getAmountChangedOn(date: CalendarDate): Amount {
    if (this.endsOn && date.daysUntil(this.endsOn) < 0) {
      return Amount.zero(this.amount.currency);
    }

    const daysUntil = this.startsOn.daysUntil(date);

    if (daysUntil < 0) {
      return Amount.zero(this.amount.currency);
    }

    if (date.day > this.startsOn.day) {
      return Amount.zero(this.amount.currency);
    }

    if (date.day < this.startsOn.day) {
      const isLastDay = date.addDays(1).month !== date.month;
      if (!isLastDay) {
        return Amount.zero(this.amount.currency);
      }
    }

    return this.amount;
  }

  public getStartsOn(): CalendarDate {
    return this.startsOn;
  }
}

import moment, { Moment } from 'moment';

import { padLeft } from './utils';

// TODO: Is this the right way to work with days and years?
export const DAYS_PER_YEAR = 365.25;

export enum Month {
  January = 1,
  February = 2,
  March = 3,
  April = 4,
  May = 5,
  June = 6,
  July = 7,
  August = 8,
  September = 9,
  October = 10,
  November = 11,
  December = 12,
}

export type CalendarDateJSON = string;

export class CalendarDate {
  public static fromDate(value: Date): CalendarDate {
    return new CalendarDate(
      value.getFullYear(),
      value.getMonth() + 1,
      value.getDate(),
    );
  }

  public static fromMoment(value: Moment): CalendarDate {
    return CalendarDate.fromString(value.format('YYYY-MM-DD'));
  }

  public static fromJSON(value: any): CalendarDate {
    if (typeof value !== 'string') {
      throw new Error('CalendarDate JSON value must be a string');
    }

    return CalendarDate.fromString(value);
  }

  /**
   * Requires a "YYYY-MM-DD" format.
   */
  public static fromString(value: string): CalendarDate {
    const match = value.match(stringPattern);
    if (!match) {
      throw new Error(
        `CalendarDate fromString value "${value}" is not a valid YYYY-MM-DD format`,
      );
    }

    return new CalendarDate(
      parseInt(match[1], 10),
      stringToMonth(match[2]),
      parseInt(match[3], 10),
    );
  }

  /**
   * TODO: Add timezone support.
   */
  public static today(): CalendarDate {
    return CalendarDate.fromDate(new Date());
  }

  constructor(public year: number, public month: Month, public day: number) {
    if (day < 1 || day > 31) {
      throw new Error(`CalendarDate day "${day}" must be between 1 and 31`);
    }

    if (`${year}`.length !== 4) {
      throw new Error(
        `CalendarDate year "${year}" must be a four digit number`,
      );
    }

    const dateString = this.toString();
    if (!moment(dateString).isValid()) {
      throw new Error(`CalendarDate "${dateString}" is invalid`);
    }
  }

  public addDays(days: number): CalendarDate {
    return CalendarDate.fromDate(
      new Date(this.year, this.month - 1, this.day + days),
    );
  }

  public addMonths(months: number): CalendarDate {
    let date = CalendarDate.fromDate(
      new Date(this.year, this.month - 1 + months, this.day),
    );

    while (this.day !== date.day) {
      // Could turn to the next month if the destination month doens't
      // have enough days in it.
      date = date.addDays(-1);
    }

    return date;
  }

  public addYears(years: number): CalendarDate {
    return CalendarDate.fromDate(
      new Date(this.year + years, this.month - 1, this.day),
    );
  }

  /**
   * For sorting.
   */
  public compare(date: CalendarDate): number {
    return this.toString().localeCompare(date.toString());
  }

  /**
   * Positive means the date is forward in time.
   */
  public daysUntil(date: CalendarDate): number {
    const diffMilliseconds = date.toDate().valueOf() - this.toDate().valueOf();
    return Math.floor(diffMilliseconds / MILLISECONDS_PER_DAY);
  }

  public toDate(): Date {
    return new Date(this.year, this.month - 1, this.day);
  }

  public toJSON(): CalendarDateJSON {
    return this.toString();
  }

  public toString(): string {
    const year = padLeft(this.year.toString(), '0000');
    const month = padLeft(`${this.month}`, '00');
    const day = padLeft(this.day.toString(), '00');
    return `${year}-${month}-${day}`;
  }
}

// TODO: Fix for leap years.
const MILLISECONDS_PER_DAY = 1000 * 60 * 60 * 24;

const stringPattern = /^(\d{4})-(\d{2})-(\d{2})$/;

const monthValues = new Set(Object.values(Month));

function stringToMonth(value: string): Month {
  const month = parseInt(value, 10);

  if (!isMonth(month)) {
    throw new Error(`Value "${value}" is not a valid month`);
  }

  return month;
}

export function isMonth(value: number): value is Month {
  return monthValues.has(value);
}

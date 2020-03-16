import moment, { Moment } from 'moment';

import { padLeft } from './utils';

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

  /**
   * For sorting.
   */
  public compare(date: CalendarDate): number {
    return this.toString().localeCompare(date.toString());
  }

  public toDate(): Date {
    return new Date(this.year, this.month, this.day);
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

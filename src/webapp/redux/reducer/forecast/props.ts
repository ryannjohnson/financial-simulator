import { Currency } from '../../../../amount';
import { CalendarDateJSON } from '../../../../calendar-date';
import * as timeline from '../../../../timeline';

export type State = {
  chart: {
    currency: Currency;
    values: ChartValue[];
  };
  eventWrappers: EventWrapper[];
  selectedEventId: string | null;
  timeline: {
    endsOn: CalendarDateJSON;
    startsOn: CalendarDateJSON;
    tracks: Track[];
  };
};

export type EventWrapper = {
  event: timeline.EventJSON;
  id: string;
};

export type Track = {
  eventIds: string[];
  id: string;
  name: string;
};

export enum ChartSampleSize {
  Day,
  Week,
  Month,
  Year,
}

export type ChartValue = {
  time: {
    year: number;
    month: number;
    day: number;
  };
  value: number;
};

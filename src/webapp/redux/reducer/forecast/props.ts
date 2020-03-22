import { Currency } from '../../../../amount';
import { CalendarDateJSON } from '../../../../calendar-date';
import * as timeline from '../../../../timeline';

export type State = {
  chart: {
    currency: Currency;
    values: number[];
  };
  eventWrappers: EventWrapper[];
  timeline: {
    endsOn: CalendarDateJSON;
    tracks: Track[];
    startsOn: CalendarDateJSON;
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

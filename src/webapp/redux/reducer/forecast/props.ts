import { Currency } from '../../../../amount';
import { CalendarDateJSON } from '../../../../calendar-date';
import { AccountJSON, EffectJSON, EventJSON } from '../../../../timeline';

export type State = {
  accountWrappers: AccountWrapper[];
  chart: {
    currency: Currency;
  };
  effects: {
    [id: string]: EffectJSON;
  };
  events: {
    [id: string]: EventJSON;
  };
  selectedTrackItem: TrackItem | null;
  timeline: {
    accountId: string | null;
    chartSampleSize: ChartSampleSize;
    endsOn: CalendarDateJSON;
    startsOn: CalendarDateJSON;
  };
};

export type AccountWrapper = {
  account: AccountJSON;
  tracks: Track[];
};

export type Track = {
  id: string;
  items: TrackItem[];
  name: string;
};

export type TrackItem = {
  id: string;
  type: TrackItemType;
};

export enum TrackItemType {
  Effect = 'EFFECT',
  Event = 'EVENT',
}

export enum ChartSampleSize {
  Day = 'DAILY',
  Week = 'WEEKLY',
  Month = 'MONTHLY',
  Quarter = 'QUARTERLY',
  Year = 'YEARLY',
}

export type ChartValue = {
  time: {
    year: number;
    month: number;
    day: number;
  };
  value: number;
};

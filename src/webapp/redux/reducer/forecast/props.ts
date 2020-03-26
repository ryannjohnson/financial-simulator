import { Currency } from '../../../../amount';
import { CalendarDateJSON } from '../../../../calendar-date';
import { AccountJSON, EffectJSON, EventJSON } from '../../../../timeline';

export type State = {
  accountWrappers: AccountWrapper[];
  chart: {
    currency: Currency;
    values: ChartValue[];
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

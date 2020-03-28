import { CalendarDateJSON } from '../../../calendar-date';
import { AccountJSON, EffectJSON, EventJSON } from '../../../timeline';
import {
  ChartSampleSize,
  State,
  Track,
  TrackItem,
} from '../reducer/forecast/props';

export const ADD_ACCOUNT = 'FORECAST_ADD_ACCOUNT';
export const ADD_EFFECT = 'FORECAST_ADD_EFFECT';
export const ADD_EVENT = 'FORECAST_ADD_EVENT';
export const ADD_TRACK = 'FORECAST_ADD_TRACK';
export const EXPORT_TIMELINE = 'FORECAST_EXPORT_TIMELINE';
export const IMPORT_TIMELINE = 'FORECAST_IMPORT_TIMELINE';
export const REMOVE_EVENT = 'FORECAST_REMOVE_EVENT';
export const RENDER_CHART = 'FORECAST_RENDER_CHART';
export const SELECT_ACCOUNT = 'FORECAST_SELECT_ACCOUNT';
export const SELECT_TRACK_ITEM = 'FORECAST_SELECT_TRACK_ITEM';
export const SET_EVENT = 'FORECAST_SET_EVENT';
export const SET_EVENT_ACCOUNT_IDS = 'FORECAST_SET_EVENT_ACCOUNT_IDS';
export const SET_TIMELINE_CALENDAR_DATES =
  'FORECAST_SET_TIMELINE_CALENDAR_DATES';
export const SET_TRACK = 'FORECAST_SET_TRACK';
export const SET_TRACK_ITEM_CALENDAR_DATES =
  'FORECAST_SET_TRACK_ITEM_CALENDAR_DATES';
export const SET_TRACK_ITEM_ENDS_ON = 'FORECAST_SET_TRACK_ITEM_ENDS_ON';
export const SET_TRACK_ITEM_STARTS_ON = 'FORECAST_SET_TRACK_ITEM_STARTS_ON';

export interface AddAccount {
  account: AccountJSON;
  type: typeof ADD_ACCOUNT;
}

export interface AddEffect {
  accountId: string;
  effect: EffectJSON;
  type: typeof ADD_EFFECT;
}

export interface AddEvent {
  event: EventJSON;
  type: typeof ADD_EVENT;
}

export interface AddTrack {
  accountId: string;
  track: Track;
  type: typeof ADD_TRACK;
}

export interface ExportTimeline {
  type: typeof EXPORT_TIMELINE;
}

export interface ImportTimeline {
  state: State;
  type: typeof IMPORT_TIMELINE;
}

export interface RemoveEvent {
  id: string;
  type: typeof REMOVE_EVENT;
}

export interface RenderChart {
  accountId: string;
  sampleSize: ChartSampleSize;
  type: typeof RENDER_CHART;
}

export interface SelectAccount {
  accountId: string | null;
  type: typeof SELECT_ACCOUNT;
}

export interface SelectTrackItem {
  trackItem: TrackItem | null;
  type: typeof SELECT_TRACK_ITEM;
}

/**
 * Used from the event pane, not from the timeline.
 */
export interface SetEvent {
  event: EventJSON;
  type: typeof SET_EVENT;
}
export interface SetEventAccountIds {
  eventId: string;
  fromAccountId: string | null;
  toAccountId: string | null;
  type: typeof SET_EVENT_ACCOUNT_IDS;
}

export interface SetTrackItemCalendarDates {
  accountId: string;
  endsOn: CalendarDateJSON | null;
  trackItem: TrackItem;
  startsOn: CalendarDateJSON | null;
  trackIndex: number;
  type: typeof SET_TRACK_ITEM_CALENDAR_DATES;
}

export interface SetTrackItemEndsOn {
  accountId: string;
  endsOn: CalendarDateJSON | null;
  trackItem: TrackItem;
  type: typeof SET_TRACK_ITEM_ENDS_ON;
}

export interface SetTrackItemStartsOn {
  accountId: string;
  trackItem: TrackItem;
  startsOn: CalendarDateJSON | null;
  type: typeof SET_TRACK_ITEM_STARTS_ON;
}

export interface SetTimelineCalendarDates {
  endsOn: CalendarDateJSON;
  startsOn: CalendarDateJSON;
  type: typeof SET_TIMELINE_CALENDAR_DATES;
}

export interface SetTrack {
  track: Track;
  type: typeof SET_TRACK;
}

export type Action =
  | AddAccount
  | AddEffect
  | AddEvent
  | AddTrack
  | ExportTimeline
  | ImportTimeline
  | RemoveEvent
  | RenderChart
  | SelectAccount
  | SelectTrackItem
  | SetEvent
  | SetEventAccountIds
  | SetTrackItemCalendarDates
  | SetTrackItemEndsOn
  | SetTrackItemStartsOn
  | SetTimelineCalendarDates
  | SetTrack;

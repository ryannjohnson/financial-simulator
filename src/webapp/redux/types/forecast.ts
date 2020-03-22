import { CalendarDateJSON } from '../../../calendar-date';
import { EventJSON } from '../../../timeline';
import { Track } from '../reducer/forecast/props';

export const ADD_EVENT = 'FORECAST_ADD_EVENT';
export const ADD_TRACK = 'FORECAST_ADD_TRACK';
export const EXPORT_EVENTS = 'FORECAST_EXPORT_EVENTS';
export const IMPORT_EVENTS = 'FORECAST_IMPORT_EVENTS';
export const REMOVE_EVENT = 'FORECAST_REMOVE_EVENT';
export const RENDER_CHART = 'FORECAST_RENDER_CHART';
export const SELECT_EVENT = 'FORECAST_SELECT_EVENT';
export const SET_EVENT = 'FORECAST_SET_EVENT';
export const SET_EVENT_CALENDAR_DATES = 'FORECAST_SET_EVENT_CALENDAR_DATES';
export const SET_EVENT_ENDS_ON = 'FORECAST_SET_EVENT_ENDS_ON';
export const SET_EVENT_STARTS_ON = 'FORECAST_SET_EVENT_STARTS_ON';
export const SET_TRACK = 'FORECAST_SET_TRACK';

export interface AddEvent {
  event: EventJSON;
  type: typeof ADD_EVENT;
}

export interface AddTrack {
  name: string;
  type: typeof ADD_TRACK;
}

export interface ExportEvents {
  type: typeof EXPORT_EVENTS;
}

export interface ImportEvents {
  events: EventJSON[];
  type: typeof IMPORT_EVENTS;
}

export interface RemoveEvent {
  id: string;
  type: typeof REMOVE_EVENT;
}

export interface RenderChart {
  events: EventJSON[];
  type: typeof RENDER_CHART;
}

export interface SelectEvent {
  id: string | null;
  type: typeof SELECT_EVENT;
}

export interface SetEvent {
  event: EventJSON;
  id: string;
  type: typeof SET_EVENT;
}

export interface SetEventCalendarDates {
  endsOn: CalendarDateJSON | null;
  eventId: string;
  startsOn: CalendarDateJSON;
  type: typeof SET_EVENT_CALENDAR_DATES;
}

export interface SetEventEndsOn {
  endsOn: CalendarDateJSON | null;
  eventId: string;
  type: typeof SET_EVENT_ENDS_ON;
}

export interface SetEventStartsOn {
  eventId: string;
  startsOn: CalendarDateJSON;
  type: typeof SET_EVENT_STARTS_ON;
}

export interface SetTrack {
  track: Track;
  id: string;
  type: typeof SET_TRACK;
}

export type Action =
  | AddEvent
  | AddTrack
  | ExportEvents
  | ImportEvents
  | RemoveEvent
  | RenderChart
  | SelectEvent
  | SetEvent
  | SetEventCalendarDates
  | SetEventEndsOn
  | SetEventStartsOn
  | SetTrack;

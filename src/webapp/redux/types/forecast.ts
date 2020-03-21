import { EventJSON, FormulaType } from '../../../timeline';

export const ADD_EVENT = 'FORECAST_ADD_EVENT';
export const EXPORT_EVENTS = 'FORECAST_EXPORT_EVENTS';
export const IMPORT_EVENTS = 'FORECAST_IMPORT_EVENTS';
export const RENDER_CHART = 'FORECAST_RENDER_CHART';
export const SET_EVENT = 'FORECAST_SET_EVENT';

export interface AddEvent {
  formulaType: FormulaType;
  type: typeof ADD_EVENT;
}

export interface ExportEvents {
  type: typeof EXPORT_EVENTS;
}

export interface ImportEvents {
  events: EventJSON[];
  type: typeof IMPORT_EVENTS;
}

export interface RenderChart {
  type: typeof RENDER_CHART;
}

export interface SetEvent {
  event: EventJSON;
  id: string;
  type: typeof SET_EVENT;
}

export type Action =
  | AddEvent
  | ExportEvents
  | ImportEvents
  | RenderChart
  | SetEvent;

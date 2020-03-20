import { EventJSON, FormulaType } from '../../../timeline';

export const ADD_EVENT = 'FORECAST_ADD_EVENT';
export const RENDER_CHART = 'FORECAST_RENDER_CHART';
export const SET_EVENT = 'FORECAST_SET_EVENT';

export interface AddEvent {
  formulaType: FormulaType;
  type: typeof ADD_EVENT;
}

export interface RenderChart {
  type: typeof RENDER_CHART;
}

export interface SetEvent {
  event: EventJSON;
  id: string;
  type: typeof SET_EVENT;
}

export type Action = AddEvent | RenderChart | SetEvent;

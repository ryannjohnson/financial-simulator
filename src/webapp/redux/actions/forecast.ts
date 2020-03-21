import { Event, FormulaType } from '../../../timeline';
import * as types from '../types';

export function addEvent(formulaType: FormulaType): types.forecast.AddEvent {
  return { formulaType, type: types.forecast.ADD_EVENT };
}

export function exportEvents(): types.forecast.ExportEvents {
  return { type: types.forecast.EXPORT_EVENTS };
}

export function importEvents(events: Event[]): types.forecast.ImportEvents {
  return {
    events: events.map(a => a.toJSON()),
    type: types.forecast.IMPORT_EVENTS,
  };
}

export function removeEvent(id: string): types.forecast.RemoveEvent {
  return { id, type: types.forecast.REMOVE_EVENT };
}

export function setEvent(id: string, event: Event): types.forecast.SetEvent {
  return { event: event.toJSON(), id, type: types.forecast.SET_EVENT };
}

export function renderChart(): types.forecast.RenderChart {
  return { type: types.forecast.RENDER_CHART };
}

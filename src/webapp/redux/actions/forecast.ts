import { CalendarDate } from '../../../calendar-date';
import { Event } from '../../../timeline';
import { Track } from '../reducer/forecast/props';
import * as types from '../types';

export function addEvent(event: Event): types.forecast.AddEvent {
  return { event: event.toJSON(), type: types.forecast.ADD_EVENT };
}

export function addTrack(name: string): types.forecast.AddTrack {
  return { name, type: types.forecast.ADD_TRACK };
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

export function renderChart(events: Event[]): types.forecast.RenderChart {
  return {
    events: events.map(a => a.toJSON()),
    type: types.forecast.RENDER_CHART,
  };
}

export function selectEvent(id: string | null): types.forecast.SelectEvent {
  return { id, type: types.forecast.SELECT_EVENT };
}

export function setEvent(id: string, event: Event): types.forecast.SetEvent {
  return { event: event.toJSON(), id, type: types.forecast.SET_EVENT };
}

export function setEventCalendarDates(
  eventId: string,
  startsOn: CalendarDate,
  endsOn: CalendarDate | null,
): types.forecast.SetEventCalendarDates {
  return {
    endsOn: endsOn ? endsOn.toJSON() : null,
    eventId,
    startsOn: startsOn.toJSON(),
    type: types.forecast.SET_EVENT_CALENDAR_DATES,
  };
}

export function setEventEndsOn(
  eventId: string,
  endsOn: CalendarDate | null,
): types.forecast.SetEventEndsOn {
  return {
    endsOn: endsOn ? endsOn.toJSON() : null,
    eventId,
    type: types.forecast.SET_EVENT_ENDS_ON,
  };
}

export function setEventStartsOn(
  eventId: string,
  startsOn: CalendarDate,
): types.forecast.SetEventStartsOn {
  return {
    eventId,
    startsOn: startsOn.toJSON(),
    type: types.forecast.SET_EVENT_STARTS_ON,
  };
}

export function setTimelineCalendarDates(
  startsOn: CalendarDate,
  endsOn: CalendarDate,
): types.forecast.SetTimelineCalendarDates {
  return {
    endsOn: endsOn.toJSON(),
    startsOn: startsOn.toJSON(),
    type: types.forecast.SET_TIMELINE_CALENDAR_DATES,
  };
}

export function setTrack(id: string, track: Track): types.forecast.SetTrack {
  return { id, track, type: types.forecast.SET_TRACK };
}

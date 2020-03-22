import { Currency } from '../../../../amount';
import { CalendarDate } from '../../../../calendar-date';
import * as types from '../../types';
import * as chart from './chart';
import * as eventWrappers from './event-wrappers';
import * as timeline from './timeline';

import { State } from './props';

export * from './props';

export function reducer(
  state: State = initialState,
  action: types.forecast.Action,
): State {
  switch (action.type) {
    case types.forecast.ADD_EVENT:
      return eventWrappers.addEvent(state, action);
    case types.forecast.ADD_TRACK:
      return timeline.addTrack(state, action);
    case types.forecast.EXPORT_EVENTS:
      return eventWrappers.exportEvents(state, action);
    case types.forecast.IMPORT_EVENTS:
      return eventWrappers.importEvents(state, action);
    case types.forecast.REMOVE_EVENT:
      return eventWrappers.removeEvent(state, action);
    case types.forecast.RENDER_CHART:
      return chart.renderChart(state, action);
    case types.forecast.SELECT_EVENT:
      return eventWrappers.selectEvent(state, action);
    case types.forecast.SET_EVENT:
      return eventWrappers.setEvent(state, action);
    case types.forecast.SET_EVENT_CALENDAR_DATES:
      return eventWrappers.setEventCalendarDates(state, action);
    case types.forecast.SET_EVENT_ENDS_ON:
      return eventWrappers.setEventEndsOn(state, action);
    case types.forecast.SET_EVENT_STARTS_ON:
      return eventWrappers.setEventStartsOn(state, action);
    default:
      return state;
  }
}

const initialState: State = {
  chart: {
    currency: Currency.USD,
    values: [],
  },
  eventWrappers: [],
  selectedEventId: null,
  timeline: {
    endsOn: CalendarDate.today()
      .addYears(5)
      .toJSON(),
    startsOn: CalendarDate.today().toJSON(),
    tracks: [],
  },
};

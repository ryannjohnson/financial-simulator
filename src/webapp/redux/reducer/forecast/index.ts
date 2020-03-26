import { Currency } from '../../../../amount';
import { CalendarDate } from '../../../../calendar-date';
import * as types from '../../types';
import * as account from './account';
import * as chart from './chart';
import * as event from './event';
import { State, TrackItemType } from './props';
import * as timeline from './timeline';

export * from './props';

export function reducer(
  state: State = initialState,
  action: types.forecast.Action,
): State {
  switch (action.type) {
    case types.forecast.ADD_ACCOUNT:
      return account.addAccount(state, action);
    case types.forecast.ADD_EVENT:
      return event.addEvent(state, action);
    case types.forecast.ADD_TRACK:
      return account.addTrack(state, action);
    case types.forecast.EXPORT_TIMELINE:
      return timeline.exportTimeline(state, action);
    case types.forecast.IMPORT_TIMELINE:
      return timeline.importTimeline(state, action);
    case types.forecast.REMOVE_EVENT:
      return event.removeEvent(state, action);
    case types.forecast.RENDER_CHART:
      return chart.renderChart(state, action);
    case types.forecast.SELECT_ACCOUNT:
      return account.selectAccount(state, action);
    case types.forecast.SELECT_TRACK_ITEM:
      return account.selectTrackItem(state, action);
    case types.forecast.SET_EVENT:
      return event.setEvent(state, action);
    case types.forecast.SET_TRACK_ITEM_CALENDAR_DATES:
      switch (action.trackItem.type) {
        case TrackItemType.Event:
          return event.setEventCalendarDates(state, action);
        default:
          return state;
      }
    case types.forecast.SET_TRACK_ITEM_ENDS_ON:
      switch (action.trackItem.type) {
        case TrackItemType.Event:
          return event.setEventEndsOn(state, action);
        default:
          return state;
      }
    case types.forecast.SET_TRACK_ITEM_STARTS_ON:
      switch (action.trackItem.type) {
        case TrackItemType.Event:
          return event.setEventStartsOn(state, action);
        default:
          return state;
      }
    case types.forecast.SET_TIMELINE_CALENDAR_DATES:
      return timeline.setTimelineCalendarDates(state, action);
    default:
      return state;
  }
}

const initialState: State = {
  accountWrappers: [],
  chart: {
    currency: Currency.USD,
    values: [],
  },
  effects: {},
  events: {},
  selectedTrackItem: null,
  timeline: {
    accountId: null,
    endsOn: CalendarDate.today()
      .addYears(5)
      .toJSON(),
    startsOn: CalendarDate.today().toJSON(),
  },
};

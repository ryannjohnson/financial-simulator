import { Currency } from '../../../../amount';
import { CalendarDate } from '../../../../calendar-date';
import { newAccount } from '../../../defaults';
import { TrackItemType } from '../../../track-item';
import * as actions from '../../actions';
import * as types from '../../types';
import * as account from './account';
import * as effect from './effect';
import * as event from './event';
import { ChartSampleSize, State } from './props';
import * as timeline from './timeline';

export * from './props';

export function reducer(
  state: State = initialState,
  action: types.forecast.Action,
): State {
  switch (action.type) {
    case types.forecast.ADD_ACCOUNT:
      return account.add(state, action);
    case types.forecast.ADD_EFFECT:
      return effect.add(state, action);
    case types.forecast.ADD_EVENT:
      return event.add(state, action);
    case types.forecast.ADD_TRACK:
      return account.addTrack(state, action);
    case types.forecast.EXPORT_TIMELINE:
      return timeline.exportTimeline(state, action);
    case types.forecast.IMPORT_TIMELINE:
      return timeline.importTimeline(state, action);
    case types.forecast.REMOVE_ACCOUNT:
      return account.remove(state, action);
    case types.forecast.REMOVE_EFFECT:
      return effect.remove(state, action);
    case types.forecast.REMOVE_EVENT:
      return event.remove(state, action);
    case types.forecast.SELECT_ACCOUNT:
      return account.select(state, action);
    case types.forecast.SELECT_TRACK_ITEM:
      return account.selectTrackItem(state, action);
    case types.forecast.SET_ACCOUNT_NAME:
      return account.setName(state, action);
    case types.forecast.SET_EFFECT:
      return effect.set(state, action);
    case types.forecast.SET_EVENT:
      return event.set(state, action);
    case types.forecast.SET_EVENT_ACCOUNT_IDS:
      return event.setAccountIds(state, action);
    case types.forecast.SET_TIMELINE_CALENDAR_DATES:
      return timeline.setTimelineCalendarDates(state, action);
    case types.forecast.SET_TIMELINE_CHART_SAMPLE_SIZE:
      return timeline.setTimelineChartSampleSize(state, action);
    case types.forecast.SET_TRACK_ITEM_ACCRUED_AMOUNTS:
      return {
        ...state,
        trackItemAccruedAmounts: action.trackItemAccruedAmounts,
      };
    case types.forecast.SET_TRACK_ITEM_CALENDAR_DATES:
      switch (action.trackItem.type) {
        case TrackItemType.Effect:
          return effect.setCalendarDates(state, action);
        case TrackItemType.Event:
          return event.setCalendarDates(state, action);
        default:
          return state;
      }
    case types.forecast.SET_TRACK_ITEM_ENDS_ON:
      switch (action.trackItem.type) {
        case TrackItemType.Effect:
          return effect.setEndsOn(state, action);
        case TrackItemType.Event:
          return event.setEndsOn(state, action);
        default:
          return state;
      }
    case types.forecast.SET_TRACK_ITEM_STARTS_ON:
      switch (action.trackItem.type) {
        case TrackItemType.Effect:
          return effect.setStartsOn(state, action);
        case TrackItemType.Event:
          return event.setStartsOn(state, action);
        default:
          return state;
      }
    default:
      return state;
  }
}

let initialState: State = {
  accountWrappers: [],
  chart: {
    currency: Currency.USD,
  },
  effects: {},
  events: {},
  selectedTrackItem: null,
  timeline: {
    accountId: null,
    chartSampleSize: ChartSampleSize.Month,
    endsOn: CalendarDate.today()
      .addYears(5)
      .toJSON(),
    startsOn: CalendarDate.today().toJSON(),
  },
  trackItemAccruedAmounts: {},
};

initialState = account.add(
  initialState,
  actions.forecast.addAccount(newAccount()),
);

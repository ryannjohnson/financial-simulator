import { Currency } from '../../../../amount';
import { CalendarDate } from '../../../../calendar-date';
import { EffectFormulaType } from '../../../../timeline';
import * as types from '../../types';
import * as account from './account';
import * as effect from './effect';
import * as event from './event';
import { ChartSampleSize, State, TrackItemType } from './props';
import * as timeline from './timeline';

export * from './props';

export function reducer(
  state: State = demoState,
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

const demoState: State = {
  accountWrappers: [
    {
      account: {
        effectIds: ['effect-inflation-1'],
        id: 'account-checking-1',
        name: 'Checking',
      },
      tracks: [
        {
          id: 'track-1',
          items: [{ id: 'effect-inflation-1', type: TrackItemType.Effect }],
          name: 'Untitled',
        },
        { id: 'track-2', items: [], name: '' },
        { id: 'track-3', items: [], name: '' },
      ],
    },
    {
      account: {
        effectIds: ['effect-inflation-1', 'effect-interest-1'],
        id: 'account-investment-1',
        name: 'Investment',
      },
      tracks: [
        {
          id: 'track-4',
          items: [{ id: 'effect-inflation-1', type: TrackItemType.Effect }],
          name: 'Untitled',
        },
        {
          id: 'track-5',
          items: [{ id: 'effect-interest-1', type: TrackItemType.Effect }],
          name: 'Untitled',
        },
        { id: 'track-6', items: [], name: '' },
      ],
    },
  ],
  chart: {
    currency: Currency.USD,
  },
  effects: {
    'effect-inflation-1': {
      endsOn: null,
      id: 'effect-inflation-1',
      formula: {
        compoundingFrequencyPerYear: null,
        nominalAnnualInterestRate: -0.03,
      },
      formulaType: EffectFormulaType.Compounding,
      name: 'Inflation',
      startsOn: null,
    },
    'effect-interest-1': {
      endsOn: null,
      id: 'effect-interest-1',
      formula: {
        compoundingFrequencyPerYear: null,
        nominalAnnualInterestRate: 0.1,
      },
      formulaType: EffectFormulaType.Compounding,
      name: 'Investment',
      startsOn: null,
    },
  },
  events: {},
  selectedTrackItem: null,
  timeline: {
    accountId: 'account-checking-1',
    chartSampleSize: ChartSampleSize.Month,
    endsOn: CalendarDate.today()
      .addYears(5)
      .toJSON(),
    startsOn: CalendarDate.today().toJSON(),
  },
};

import { Currency } from '../../../../amount';
import { CalendarDate } from '../../../../calendar-date';
import { Account, Effect, Event } from '../../../../timeline';
import * as actions from '../../actions';
import * as types from '../../types';
import { add as addAccount, select as selectAccount } from './account';
import { add as addEffect } from './effect';
import { add as addEvent } from './event';
import { ChartSampleSize, State } from './props';

export function exportTimeline(
  state: State,
  _: types.forecast.ExportTimeline,
): State {
  const accounts = state.accountWrappers.map(a => a.account);
  const effects = Object.values(state.effects);
  const events = Object.values(state.events);
  const data = { accounts, effects, events };

  const blob = new Blob([JSON.stringify(data)], {
    type: 'application/json',
  });

  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  const date = new Date().toISOString();
  a.download = `${date.split('T')[0]}_FinancialPlannerExport.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);

  return state;
}

type EffectWrapper = {
  accountIds: string[];
  effect: Effect;
};

export function importTimeline(
  _: State,
  action: types.forecast.ImportTimeline,
): State {
  const accounts = action.data.accounts.map(Account.fromJSON);
  const effects = action.data.effects.map(Effect.fromJSON);
  const events = action.data.events.map(Event.fromJSON);

  const effectWrappers = effects.reduce((acc, effect) => {
    acc[effect.id] = { accountIds: [], effect };
    return acc;
  }, {} as { [key: string]: EffectWrapper });

  let earliestDate = CalendarDate.today();
  let latestDate = earliestDate.addYears(5);
  for (const item of [...effects, ...events]) {
    if (item.startsOn && item.startsOn.daysBefore(earliestDate) > 0) {
      earliestDate = item.startsOn;
    }
    if (item.endsOn && item.endsOn.daysAfter(latestDate) > 0) {
      latestDate = item.endsOn;
    }
  }

  let state = { ...emptyState };

  state = setTimelineCalendarDates(
    state,
    actions.forecast.setTimelineCalendarDates(earliestDate, latestDate),
  );

  for (const account of accounts) {
    for (const effectId of account.effectIds) {
      if (!effectWrappers[effectId]) {
        // Validation of effect ids vs accounts, since we're kind of
        // cheating the data in.
        throw new Error(`Account effect by id "${effectId}" not found`);
      }
      // Action for adding effects requires at least one account.
      effectWrappers[effectId].accountIds.push(account.id);
    }
    state = addAccount(state, actions.forecast.addAccount(account));
  }

  for (const { accountIds, effect } of Object.values(effectWrappers)) {
    if (accountIds.length === 0) {
      throw new Error(`Effect "${effect.id}" isn't applied to any accounts`);
    }
    state = addEffect(state, actions.forecast.addEffect(accountIds[0], effect));
  }

  for (const event of events) {
    state = addEvent(state, actions.forecast.addEvent(event));
  }

  const accountId = accounts.length > 0 ? accounts[0].id : null;
  state = selectAccount(state, actions.forecast.selectAccount(accountId));

  return state;
}

export function setTimelineCalendarDates(
  state: State,
  action: types.forecast.SetTimelineCalendarDates,
): State {
  return {
    ...state,
    timeline: {
      ...state.timeline,
      endsOn: action.endsOn,
      startsOn: action.startsOn,
    },
  };
}

export function setTimelineChartSampleSize(
  state: State,
  action: types.forecast.SetTimelineChartSampleSize,
): State {
  return {
    ...state,
    timeline: {
      ...state.timeline,
      chartSampleSize: action.chartSampleSize,
    },
  };
}

const emptyState: State = {
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

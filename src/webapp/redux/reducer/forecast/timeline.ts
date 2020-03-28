import * as types from '../../types';
import { State } from './props';

export function exportTimeline(
  state: State,
  _: types.forecast.ExportTimeline,
): State {
  // TODO: Collapse format into essentials.
  const blob = new Blob([JSON.stringify(state)], {
    type: 'application/json',
  });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  const date = new Date().toISOString();
  a.download = `${date.split('T')[0]}_ForecastEvents.json`;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);

  return state;
}

export function importTimeline(
  _: State,
  action: types.forecast.ImportTimeline,
): State {
  // TODO: Validate and rebuild.
  return { ...action.state };
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

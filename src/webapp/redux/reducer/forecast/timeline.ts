// import * as timeline from '../../../../timeline';
import * as types from '../../types';
// import * as actions from '../../actions';
import { State } from './props';

export function exportTimeline(
  state: State,
  _: types.forecast.ExportTimeline,
): State {
  throw new Error(`TODO`);
  const eventsJSON = Object.values(state.events);
  const blob = new Blob([JSON.stringify(eventsJSON, null, 2)], {
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
  state: State,
  action: types.forecast.ImportTimeline,
): State {
  console.log(state, action);
  throw new Error(`TODO`);
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

import { State } from '../reducer';

export function getChart(state: State) {
  return state.forecast.chart;
}

export function getEventWrappers(state: State) {
  return state.forecast.eventWrappers;
}

export function getEventWrapper(state: State, id: string) {
  const eventWrappers = getEventWrappers(state);
  const eventWrapper = eventWrappers.find(
    eventWrapper => eventWrapper.id === id,
  );
  if (!eventWrapper) {
    throw new Error(`Event not found by id "${id}"`);
  }
  return eventWrapper;
}

export function getSelectedEventId(state: State) {
  return state.forecast.selectedEventId;
}

export function getTrack(state: State, id: string) {
  const track = state.forecast.timeline.tracks.find(t => t.id === id);
  if (!track) {
    throw new Error(`Track not found by id "${id}"`);
  }
  return track;
}

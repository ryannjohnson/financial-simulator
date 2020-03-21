import { RootState } from '../reducer';

export function getEventWrappers(state: RootState) {
  return state.forecast.eventWrappers;
}

export function getEventWrapper(state: RootState, id: string) {
  const eventWrappers = getEventWrappers(state);
  const eventWrapper = eventWrappers.find(
    eventWrapper => eventWrapper.id === id,
  );
  if (!eventWrapper) {
    throw new Error(`Event not found by id "${id}"`);
  }
  return eventWrapper;
}

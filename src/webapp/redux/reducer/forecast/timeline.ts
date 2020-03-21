import * as types from '../../types';

export type State = {
  tracks: Array<{
    eventIds: string[];
    name: string;
  }>;
};

export function reducer(
  state: State = initialState,
  action: types.forecast.Action,
): State {
  switch (action.type) {
    default:
      return state;
  }
}

const initialState: State = {
  tracks: [
    {
      eventIds: [],
      name: 'Untitled track',
    },
  ],
};

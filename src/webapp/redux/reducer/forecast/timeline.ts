import { generateLocalUUID } from '../../../../utils';
import * as types from '../../types';
import { State, Track } from './props';

export function addTrack(state: State, action: types.forecast.AddTrack): State {
  return {
    ...state,
    timeline: {
      ...state.timeline,
      tracks: [
        ...state.timeline.tracks,
        {
          eventIds: [],
          id: generateLocalUUID(),
          name: action.name,
        },
      ],
    },
  };
}

export function setTrack(state: State, action: types.forecast.SetTrack): State {
  let tracks: Track[] = [];

  for (const track of state.timeline.tracks) {
    if (track.id !== action.id) {
      tracks = [...tracks, track];
    } else {
      tracks = [...tracks, action.track];
    }
  }

  return {
    ...state,
    timeline: {
      ...state.timeline,
      tracks,
    },
  };
}

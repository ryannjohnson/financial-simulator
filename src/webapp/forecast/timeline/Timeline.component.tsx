import * as React from 'react';

import * as actions from '../../redux/actions';
import TrackContainer from './Track.container';

type Props = {
  addTrack: typeof actions.forecast.addTrack;
  trackIds: string[];
};

export default function TimelineComponent({ addTrack, trackIds }: Props) {
  return (
    <div>
      <div>
        {trackIds.map(trackId => (
          <TrackContainer key={trackId} trackId={trackId} />
        ))}
        <div>
          <button onClick={() => addTrack('Untitled track')}>
            + Add track
          </button>
        </div>
      </div>
    </div>
  );
}

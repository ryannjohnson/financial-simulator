import { connect } from 'react-redux';

import { State } from '../../redux/reducer';
import * as selectors from '../../redux/selectors';
import TrackComponent from './Track.component';

type Props = {
  trackId: string;
};

const mapState = (state: State, props: Props) => {
  const track = selectors.forecast.getTrack(state, props.trackId);

  return {
    eventIds: track.eventIds,
    name: track.name,
  };
};

export default connect(mapState)(TrackComponent);

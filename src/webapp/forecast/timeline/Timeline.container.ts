import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import TimelineComponent from './Timeline.component';

const mapState = (state: State) => {
  return {
    trackIds: state.forecast.timeline.tracks.map(t => t.id),
  };
};

const mapDispatch = {
  addTrack: actions.forecast.addTrack,
};

export default connect(mapState, mapDispatch)(TimelineComponent);

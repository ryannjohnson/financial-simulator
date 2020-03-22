import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import * as selectors from '../../redux/selectors';
import TimelineComponent from './Timeline.component';

const mapState = (state: State) => {
  return {
    eventIds: selectors.forecast.getEventWrappers(state).map(a => a.id),
    trackIds: selectors.forecast.getTracks(state).map(a => a.id),
  };
};

const mapDispatch = {
  addTrack: actions.forecast.addTrack,
};

export default connect(mapState, mapDispatch)(TimelineComponent);

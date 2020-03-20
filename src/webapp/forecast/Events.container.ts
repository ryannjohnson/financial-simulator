import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { RootState } from '../redux/reducer';
import EventsComponent from './Events.component';

const mapState = (state: RootState) => {
  return {
    eventWrappers: state.forecast.eventWrappers,
  };
};

const mapDispatch = {
  addEvent: actions.forecast.addEvent,
};

export default connect(mapState, mapDispatch)(EventsComponent);

import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { RootState } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import EventComponent from './Event.component';

const mapState = (state: RootState, props: { eventId: string }) => {
  const { event } = selectors.forecast.getEventWrapper(state, props.eventId);
  return {
    ...event,
  };
};

const mapDispatch = {
  removeEvent: actions.forecast.removeEvent,
  setEvent: actions.forecast.setEvent,
};

export default connect(mapState, mapDispatch)(EventComponent);

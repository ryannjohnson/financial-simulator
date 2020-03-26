import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import EventComponent from './Event.component';

type Props = {
  eventId: string;
};

const mapState = (state: State, props: Props) => {
  const event = selectors.forecast.getEvent(state, props.eventId);

  return {
    ...event,
  };
};

const mapDispatch = {
  removeEvent: actions.forecast.removeEvent,
  setEvent: actions.forecast.setEvent,
};

export default connect(mapState, mapDispatch)(EventComponent);

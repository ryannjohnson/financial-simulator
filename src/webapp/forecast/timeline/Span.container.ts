import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import * as selectors from '../../redux/selectors';
import SpanComponent from './Span.component';

type Props = {
  eventId: string;
};

const mapState = (state: State, props: Props) => {
  const { event } = selectors.forecast.getEventWrapper(state, props.eventId);

  return {
    endsOn: event.endsOn,
    startsOn: event.startsOn,
    timelineEndsOn: state.forecast.timeline.endsOn,
    timelineStartsOn: state.forecast.timeline.startsOn,
  };
};

const mapDispatch = {
  setEventCalendarDates: actions.forecast.setEventCalendarDates,
};

export default connect(mapState, mapDispatch)(SpanComponent);

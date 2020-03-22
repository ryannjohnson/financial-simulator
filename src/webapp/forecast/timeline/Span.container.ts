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
  const selectedEventId = selectors.forecast.getSelectedEventId(state);

  return {
    endsOn: event.endsOn,
    formulaType: event.formulaType,
    isSelected: props.eventId === selectedEventId,
    startsOn: event.startsOn,
    timelineEndsOn: state.forecast.timeline.endsOn,
    timelineStartsOn: state.forecast.timeline.startsOn,
  };
};

const mapDispatch = {
  selectEvent: actions.forecast.selectEvent,
  setEventCalendarDates: actions.forecast.setEventCalendarDates,
  setEventEndsOn: actions.forecast.setEventEndsOn,
  setEventStartsOn: actions.forecast.setEventStartsOn,
};

export default connect(mapState, mapDispatch)(SpanComponent);

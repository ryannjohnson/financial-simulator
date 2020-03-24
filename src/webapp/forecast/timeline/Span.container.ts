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
  // TODO: Make this more efficient if performance suffers.
  const trackIndex = selectors.forecast
    .getTracks(state)
    .findIndex(track => track.eventIds.includes(props.eventId));
  if (trackIndex === -1) {
    throw new Error(`Event id "${props.eventId}" doesn't have a track`);
  }

  return {
    endsOn: event.endsOn,
    isSelected: props.eventId === selectedEventId,
    label: event.name || `[${event.formulaType}]`,
    startsOn: event.startsOn,
    timelineEndsOn: state.forecast.timeline.endsOn,
    timelineStartsOn: state.forecast.timeline.startsOn,
    trackIndex,
  };
};

const mapDispatch = {
  selectEvent: actions.forecast.selectEvent,
  setEventCalendarDates: actions.forecast.setEventCalendarDates,
  setEventEndsOn: actions.forecast.setEventEndsOn,
  setEventStartsOn: actions.forecast.setEventStartsOn,
};

export default connect(mapState, mapDispatch)(SpanComponent);

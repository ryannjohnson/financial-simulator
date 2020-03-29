import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import TimelineDatesComponent from './TimelineDates.component';

const mapState = (state: State) => {
  return {
    endsOn: selectors.forecast.getTimelineEndsOn(state),
    startsOn: selectors.forecast.getTimelineStartsOn(state),
  };
};

const mapDispatch = {
  setDates: actions.forecast.setTimelineCalendarDates,
};

export default connect(mapState, mapDispatch)(TimelineDatesComponent);

import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import InspectorComponent from './Inspector.component';

const mapState = (state: State) => {
  const selectedAccountWrapper = selectors.forecast.getSelectedAccountWrapper(
    state,
  );

  return {
    selectedAccountId: selectedAccountWrapper
      ? selectedAccountWrapper.account.id
      : null,
    selectedTrackItem: selectors.forecast.getSelectedTrackItem(state),
    timelineEndsOn: selectors.forecast.getTimelineEndsOn(state),
    timelineStartsOn: selectors.forecast.getTimelineStartsOn(state),
  };
};

const mapDispatch = {
  addEvent: actions.forecast.addEvent,
  exportTimeline: actions.forecast.exportTimeline,
  importTimeline: actions.forecast.importTimeline,
  renderChart: actions.forecast.renderChart,
  setEvent: actions.forecast.setEvent,
  setTimelineCalendarDates: actions.forecast.setTimelineCalendarDates,
};

export default connect(mapState, mapDispatch)(InspectorComponent);

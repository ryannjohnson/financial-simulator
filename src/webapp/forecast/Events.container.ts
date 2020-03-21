import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { RootState } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import EventsComponent from './Events.component';

const mapState = (state: RootState) => {
  return {
    eventIds: selectors.forecast.getEventWrappers(state).map(a => a.id),
  };
};

const mapDispatch = {
  addEvent: actions.forecast.addEvent,
  exportEvents: actions.forecast.exportEvents,
  importEvents: actions.forecast.importEvents,
  renderChart: actions.forecast.renderChart,
  setEvent: actions.forecast.setEvent,
};

export default connect(mapState, mapDispatch)(EventsComponent);

import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import EventsComponent from './Events.component';

const mapState = (state: State) => {
  return {
    selectedEventId: selectors.forecast.getSelectedEventId(state),
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

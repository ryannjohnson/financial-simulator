import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import RenderChartComponent from './RenderChart.component';

const mapState = (state: State) => {
  return {
    eventIds: selectors.forecast.getEventWrappers(state).map(a => a.id),
  };
};

const mapDispatch = {
  renderChart: actions.forecast.renderChart,
};

export default connect(mapState, mapDispatch)(RenderChartComponent);

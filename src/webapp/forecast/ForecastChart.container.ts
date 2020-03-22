import { connect } from 'react-redux';

import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import ChartComponent from '../chart/Chart.component';

const mapState = (state: State) => {
  const { startsOn } = state.forecast.timeline;
  const { values } = selectors.forecast.getChart(state);

  return {
    startsOn,
    values,
  };
};

export default connect(mapState)(ChartComponent);

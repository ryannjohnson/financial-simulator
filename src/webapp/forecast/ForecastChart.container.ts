import { connect } from 'react-redux';

import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import ChartComponent from '../chart/Chart.component';

const mapState = (state: State) => {
  return {
    ...selectors.forecast.getChart(state),
  };
};

export default connect(mapState)(ChartComponent);

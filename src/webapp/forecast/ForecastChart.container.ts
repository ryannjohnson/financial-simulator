import { connect } from 'react-redux';

import { RootState } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import ChartComponent from '../chart/Chart.component';

const mapState = (state: RootState) => {
  return {
    ...selectors.forecast.getChart(state),
  };
};

export default connect(mapState)(ChartComponent);

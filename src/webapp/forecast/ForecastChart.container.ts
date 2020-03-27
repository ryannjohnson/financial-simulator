import { connect } from 'react-redux';

import ChartComponent from '../components/Chart.component';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';

const mapState = (state: State) => {
  const { startsOn } = state.forecast.timeline;
  const { values } = selectors.forecast.getChart(state);

  return {
    startsOn,
    values,
  };
};

export default connect(mapState)(ChartComponent);

import { connect } from 'react-redux';

import { RootState } from '../redux/reducer';
import ForecastComponent from './Forecast.component';

const mapState = (state: RootState) => {
  return {
    chartValues: state.forecast.chartValues,
  };
};

export default connect(mapState)(ForecastComponent);

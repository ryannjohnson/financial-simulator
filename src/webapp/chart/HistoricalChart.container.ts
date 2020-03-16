import { connect } from 'react-redux';

import { RootState } from '../redux/reducer';
import HistoricalChartComponent from './HistoricalChart.component';

const mapState = (state: RootState) => {
  return {
    accounts: state.accounts.items,
  };
};

export default connect(mapState)(HistoricalChartComponent);

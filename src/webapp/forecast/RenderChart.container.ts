import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import RenderChartComponent from './RenderChart.component';

const mapState = (state: State) => {
  const selectedAccountWrapper = selectors.forecast.getSelectedAccountWrapper(
    state,
  );

  return {
    accountId: selectedAccountWrapper
      ? selectedAccountWrapper.account.id
      : null,
  };
};

const mapDispatch = {
  renderChart: actions.forecast.renderChart,
};

export default connect(mapState, mapDispatch)(RenderChartComponent);

import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import ChartSampleSizeComponent from './ChartSampleSize.component';

const mapState = (state: State) => {
  const selectedAccountWrapper = selectors.forecast.getSelectedAccountWrapper(
    state,
  );

  const selected = selectors.forecast.getTimelineChartSampleSize(state);

  return {
    accountId: selectedAccountWrapper
      ? selectedAccountWrapper.account.id
      : null,
    selected,
  };
};

const mapDispatch = {
  setValue: actions.forecast.setTimelineChartSampleSize,
};

export default connect(mapState, mapDispatch)(ChartSampleSizeComponent);

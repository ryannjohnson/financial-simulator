import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import * as selectors from '../../redux/selectors';
import TimelineFrameComponent from './TimelineFrame.component';

const mapState = (state: State) => {
  const selectedAccountWrapper = selectors.forecast.getSelectedAccountWrapper(
    state,
  );

  return {
    accountIds: selectors.forecast
      .getAccountWrappers(state)
      .map(a => a.account.id),
    selectedAccountId: selectedAccountWrapper
      ? selectedAccountWrapper.account.id
      : null,
  };
};

const mapDispatch = {
  addAccount: actions.forecast.addAccount,
};

export default connect(mapState, mapDispatch)(TimelineFrameComponent);

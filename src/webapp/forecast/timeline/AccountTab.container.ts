import { connect } from 'react-redux';

import * as actions from '../../redux/actions';
import { State } from '../../redux/reducer';
import * as selectors from '../../redux/selectors';
import AccountTabComponent from './AccountTab.component';

type Props = {
  accountId: string;
};

const mapState = (state: State, props: Props) => {
  const accountWrapper = selectors.forecast.getAccountWrapper(
    state,
    props.accountId,
  );

  const isSelected = state.forecast.timeline.accountId === props.accountId;

  return {
    isSelected,
    name: accountWrapper.account.name,
  };
};

const mapDispatch = {
  selectAccount: actions.forecast.selectAccount,
};

export default connect(mapState, mapDispatch)(AccountTabComponent);

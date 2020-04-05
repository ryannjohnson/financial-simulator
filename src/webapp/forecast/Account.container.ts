import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import * as selectors from '../redux/selectors';
import AccountComponent from './Account.component';

type Props = {
  accountId: string;
};

const mapState = (state: State, props: Props) => {
  const accountWrapper = selectors.forecast.getAccountWrapper(
    state,
    props.accountId,
  );

  return {
    name: accountWrapper.account.name,
    timelineStartsOn: state.forecast.timeline.startsOn,
  };
};

const mapDispatch = {
  addEffect: actions.forecast.addEffect,
  addEvent: actions.forecast.addEvent,
  setAccountName: actions.forecast.setAccountName,
};

export default connect(mapState, mapDispatch)(AccountComponent);

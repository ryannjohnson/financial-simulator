import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { State } from '../redux/reducer';
import AccountsComponent from './Accounts.component';

const mapState = (state: State) => {
  return {
    accounts: state.accounts.items,
  };
};

const mapDispatch = {
  addAccount: actions.accounts.add,
};

export default connect(mapState, mapDispatch)(AccountsComponent);

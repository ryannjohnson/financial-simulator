import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import { RootState } from '../redux/reducer';
import AccountsComponent from './Accounts.component';

const mapState = (state: RootState) => {
  return {
    accounts: state.accounts.items,
  };
};

const mapDispatch = {
  addAccount: actions.accounts.add,
};

export default connect(mapState, mapDispatch)(AccountsComponent);

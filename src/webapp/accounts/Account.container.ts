import { connect } from 'react-redux';

import * as actions from '../redux/actions';
import AccountComponent from './Account.component';

const mapDispatch = {
  replaceTransactionsForDateRange:
    actions.accounts.replaceTransactionsForDateRange,
  setBalance: actions.accounts.setBalance,
  setName: actions.accounts.setName,
};

export default connect(null, mapDispatch)(AccountComponent);

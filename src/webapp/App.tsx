import * as React from 'react';
import { Provider } from 'react-redux';

import AccountsContainer from './accounts/Accounts.container';
import { store } from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <AccountsContainer />
    </Provider>
  );
}

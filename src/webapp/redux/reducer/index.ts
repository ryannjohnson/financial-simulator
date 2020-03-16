import { combineReducers } from 'redux';

import { reducer as accountsReducer } from './accounts';

export const rootReducer = combineReducers({
  accounts: accountsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

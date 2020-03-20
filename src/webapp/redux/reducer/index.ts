import { combineReducers } from 'redux';

import { reducer as accountsReducer } from './accounts';
import { reducer as forecastReducer } from './forecast';

export const rootReducer = combineReducers({
  accounts: accountsReducer,
  forecast: forecastReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

import { combineReducers } from 'redux';

import { reducer as accounts } from './accounts';
import { reducer as forecast } from './forecast';

export const reducer = combineReducers({ accounts, forecast });

export type State = ReturnType<typeof reducer>;

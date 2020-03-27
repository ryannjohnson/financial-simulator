import { combineReducers } from 'redux';

import { reducer as forecast } from './forecast';

export const reducer = combineReducers({ forecast });

export type State = ReturnType<typeof reducer>;

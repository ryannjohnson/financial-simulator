import { combineReducers } from 'redux';

import { reducer as chart } from './chart';
import { reducer as eventWrappers } from './event-wrappers';
import { reducer as timeline } from './timeline';

export const reducer = combineReducers({ chart, eventWrappers, timeline });

export type State = ReturnType<typeof reducer>;

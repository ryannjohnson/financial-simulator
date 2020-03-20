import * as React from 'react';
import { Provider } from 'react-redux';

import ForecastComponent from './forecast/Forecast.component';

import { store } from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <ForecastComponent {...store.getState().forecast} />
    </Provider>
  );
}

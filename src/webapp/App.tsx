import * as React from 'react';
import { Provider } from 'react-redux';

import ForecastContainer from './forecast/Forecast.container';

import { store } from './redux/store';

export default function App() {
  return (
    <Provider store={store}>
      <ForecastContainer />
    </Provider>
  );
}

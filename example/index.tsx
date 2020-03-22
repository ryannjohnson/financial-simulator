import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { App } from '../src/webapp';

const AppContainer = () => {
  return (
    <div style={appContainerStyle}>
      <App />
    </div>
  );
};

const appContainerStyle: React.CSSProperties = {
  height: '100vh',
  left: 0,
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  width: '100vw',
};

ReactDOM.render(<AppContainer />, document.getElementById('root'));

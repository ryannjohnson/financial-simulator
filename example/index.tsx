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

console.info(`               .''.
             .'....'.
           .'.      .'.
         .'.          .'.
       .'.              .'.
     .'.                  .'.
   .'.                      .'.
 .'.                          .'.
,l.            :dd:            .l,
.dO;        .:OWMMWO:.        ;Od.
 '0NO:.    :OWMMMMMMWO:    .:ON0'
  ;KWNO;.;OWMMMNKKNMMMWO;.;ONWK;
   .oKWNXNMMMNk,..,kNMMMNXNWKo.
     .oKWMMNk,      ,kNMMWKo.
       .o0x,          ,x0o.
         .              .

Hi!

I made this financial planning app with a few goals in mind:

1. To view how my finances fit into the context of my life.
2. To retain control over my data.

I hope you find it useful. Email me with feedback 👍

-Ryan`);

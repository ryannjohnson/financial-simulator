import * as React from 'react';

import EventsContainer from './Events.container';

export default function ForecastComponent() {
  return (
    <div style={containerStyle}>
      <EventsContainer />
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
};

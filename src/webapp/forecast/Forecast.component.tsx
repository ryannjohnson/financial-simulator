import * as React from 'react';

import EventsContainer from './Events.container';
import ForecastChartContainer from './ForecastChart.container';

export default function ForecastComponent() {
  return (
    <div style={containerStyle}>
      <div style={eventsContainerStyle}>
        <EventsContainer />
      </div>
      <div style={chartContainerStyle}>
        <ForecastChartContainer />
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  height: 'calc(100vh - 30px)',
};

const chartContainerStyle: React.CSSProperties = {
  flexGrow: 1,
  position: 'relative',
  zIndex: 4,
};

const eventsContainerStyle: React.CSSProperties = {
  paddingRight: '30px',
  position: 'relative',
  zIndex: 5,
};

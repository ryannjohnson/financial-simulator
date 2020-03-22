import * as React from 'react';

import EventsContainer from './Events.container';
import ForecastChartContainer from './ForecastChart.container';
import TimelineContainer from './timeline/Timeline.container';

export default function ForecastComponent() {
  return (
    <div style={containerStyle}>
      <div style={topContainerStyle}>
        <div style={eventsContainerStyle}>
          <EventsContainer />
        </div>
        <div style={chartContainerStyle}>
          <ForecastChartContainer />
        </div>
      </div>
      <div style={timelineContainerStyle}>
        <TimelineContainer />
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
};

const topContainerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  flexGrow: 1,
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

const timelineContainerStyle: React.CSSProperties = {
  height: '30%',
  maxHeight: '250px',
  overflow: 'auto',
};

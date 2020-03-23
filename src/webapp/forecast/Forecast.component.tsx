import * as React from 'react';

import * as colors from '../colors';
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
  overflow: 'hidden',
  position: 'relative',
};

const eventsContainerStyle: React.CSSProperties = {
  paddingRight: '30px',
  position: 'relative',
  overflow: 'auto',
  zIndex: 5,
};

const chartContainerStyle: React.CSSProperties = {
  flexGrow: 1,
  position: 'relative',
  zIndex: 4,
};

const timelineContainerStyle: React.CSSProperties = {
  background: colors.DARK_GRAY,
  height: '30%',
  maxHeight: '500px',
  minHeight: '300px',
  overflow: 'auto',
};

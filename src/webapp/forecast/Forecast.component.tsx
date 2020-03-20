import * as React from 'react';

import ChartComponent from '../chart/Chart.component';
import EventsContainer from './Events.container';

type Props = {
  chartValues: number[];
};

export default function ForecastComponent({ chartValues }: Props) {
  return (
    <div style={containerStyle}>
      <EventsContainer />
      <div style={chartContainerStyle}>
        <ChartComponent values={chartValues} />
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
};

const chartContainerStyle: React.CSSProperties = {
  height: '400px',
  position: 'relative',
  width: '400px',
};

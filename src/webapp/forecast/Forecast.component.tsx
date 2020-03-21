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
  height: 'calc(100vh - 30px)',
};

const chartContainerStyle: React.CSSProperties = {
  flexGrow: 1,
  position: 'relative',
};

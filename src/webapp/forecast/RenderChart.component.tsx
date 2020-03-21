import * as React from 'react';

import { Event, EventJSON } from '../../timeline';
import * as actions from '../redux/actions';

type Props = {
  events: EventJSON[];
  renderChart: typeof actions.forecast.renderChart;
};

export default function RenderChartComponent({ events, renderChart }: Props) {
  const onClick = () => renderChart(events.map(a => Event.fromJSON(a)));
  return <button onClick={onClick}>Render</button>;
}

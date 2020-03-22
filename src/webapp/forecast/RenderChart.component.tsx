import * as React from 'react';

import * as actions from '../redux/actions';
import { ChartSampleSize } from '../redux/reducer/forecast/props';

type Props = {
  eventIds: string[];
  renderChart: typeof actions.forecast.renderChart;
};

export default function RenderChartComponent({ eventIds, renderChart }: Props) {
  const onClickHandler = (sampleSize: ChartSampleSize) => () =>
    renderChart(eventIds, sampleSize);
  return (
    <div>
      <button onClick={onClickHandler(ChartSampleSize.Day)}>Daily</button>
      <button onClick={onClickHandler(ChartSampleSize.Week)}>Weekly</button>
      <button onClick={onClickHandler(ChartSampleSize.Month)}>Monthly</button>
      <button onClick={onClickHandler(ChartSampleSize.Year)}>Yearly</button>
    </div>
  );
}

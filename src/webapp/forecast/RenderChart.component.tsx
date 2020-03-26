import * as React from 'react';

import * as actions from '../redux/actions';
import { ChartSampleSize } from '../redux/reducer/forecast/props';

type Props = {
  accountId: string | null;
  renderChart: typeof actions.forecast.renderChart;
};

export default function RenderChartComponent({
  accountId,
  renderChart,
}: Props) {
  if (!accountId) {
    return null;
  }

  const onClickHandler = (sampleSize: ChartSampleSize) => () =>
    renderChart(accountId, sampleSize);

  return (
    <div>
      <button onClick={onClickHandler(ChartSampleSize.Day)}>Daily</button>
      <button onClick={onClickHandler(ChartSampleSize.Week)}>Weekly</button>
      <button onClick={onClickHandler(ChartSampleSize.Month)}>Monthly</button>
      <button onClick={onClickHandler(ChartSampleSize.Year)}>Yearly</button>
    </div>
  );
}

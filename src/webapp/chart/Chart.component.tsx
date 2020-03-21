import * as lightweightCharts from 'lightweight-charts';
import * as React from 'react';

import { CalendarDate, CalendarDateJSON } from '../../calendar-date';

type Props = {
  startsOn: CalendarDateJSON;
  values: number[];
};

export default class ChartComponent extends React.Component<Props> {
  private chart: lightweightCharts.IChartApi | null = null;
  private containerRef: HTMLDivElement | null = null;
  private lineSeries: lightweightCharts.ISeriesApi<'Line'> | null = null;

  componentDidMount() {
    this.chart = lightweightCharts.createChart(this.containerRef!);
    this.lineSeries = this.chart.addLineSeries();
  }

  componentDidUpdate() {
    const startsOn = CalendarDate.fromJSON(this.props.startsOn);

    this.lineSeries!.setData(
      this.props.values.map((value, i) => {
        return {
          time: startsOn.addDays(i).toString(),
          value: value / 100, // TODO: Make it not just for USD.
        };
      }),
    );

    this.chart!.timeScale().fitContent();
  }

  componentWillUnmount() {
    this.chart!.remove();
  }

  render() {
    return (
      <div ref={ref => (this.containerRef = ref)} style={containerStyle} />
    );
  }
}

const containerStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
};

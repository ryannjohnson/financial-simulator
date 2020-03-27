import * as lightweightCharts from 'lightweight-charts';
import * as React from 'react';

import { CalendarDateJSON } from '../../calendar-date';
import * as colors from '../colors';

type Props = {
  startsOn: CalendarDateJSON;
  values: Value[];
};

export type Value = {
  time: { year: number; month: number; day: number };
  value: number;
};

export default class ChartComponent extends React.Component<Props> {
  private chart: lightweightCharts.IChartApi | null = null;
  private containerRef: HTMLDivElement | null = null;
  private lineSeries: lightweightCharts.ISeriesApi<'Line'> | null = null;

  componentDidMount() {
    this.chart = lightweightCharts.createChart(this.containerRef!, {
      localization: { priceFormatter },
    });
    this.lineSeries = this.chart.addLineSeries();
  }

  componentDidUpdate() {
    this.lineSeries!.setData(this.props.values);
    this.chart!.timeScale().fitContent();
  }

  componentWillUnmount() {
    this.chart!.remove();
  }

  render() {
    return (
      <div style={containerStyle}>
        <div style={attributionStyle}>
          Chart by{' '}
          <a href="https://www.tradingview.com/">
            https://www.tradingview.com/
          </a>
          .
        </div>
        <div
          ref={ref => (this.containerRef = ref)}
          style={chartContainerStyle}
        />
      </div>
    );
  }
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  position: 'relative',
  width: '100%',
};

const chartContainerStyle: React.CSSProperties = {
  flexGrow: 1,
  zIndex: 1,
};

const attributionStyle: React.CSSProperties = {
  background: colors.WHITE,
  fontSize: 11,
  padding: '5px',
  textAlign: 'right',
};

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const priceFormatter = (priceValue: number) =>
  formatter.format(priceValue / 100);

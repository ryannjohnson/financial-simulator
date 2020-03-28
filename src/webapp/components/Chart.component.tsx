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
  private series: lightweightCharts.ISeriesApi<'Area'> | null = null;

  componentDidMount() {
    this.chart = lightweightCharts.createChart(this.containerRef!, {
      localization: { priceFormatter },
      priceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
      },
      ...theme.chart,
    });
    this.series = this.chart.addAreaSeries(theme.series);
  }

  componentDidUpdate() {
    this.series!.setData(this.props.values);
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
          <a href="https://www.tradingview.com/" style={attributionLinkStyle}>
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
  fontSize: 11,
  padding: '5px',
  textAlign: 'right',
};

const attributionLinkStyle: React.CSSProperties = {
  color: colors.WHITE,
};

const theme = {
  chart: {
    layout: {
      backgroundColor: colors.BLACK, // '#2B2B43',
      fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI","Roboto","Oxygen","Ubuntu","Cantarell","Fira Sans","Droid Sans","Helvetica Neue",sansSerif',
      lineColor: colors.WHITE, // '#2B2B43',
      textColor: colors.WHITE2, // '#D9D9D9',
    },
    watermark: {
      color: colors.DARKBLACK, // 'rgba(0, 0, 0, 0)',
    },
    crosshairs: {
      color: colors.GREY, // '#758696',
    },
    grid: {
      vertLines: {
        color: colors.LIGHTBLACK2, // '#2B2B43',
      },
      horzLines: {
        color: colors.LIGHTBLACK3, // '#363C4E',
      },
    },
  },
  series: {
    topColor: colors.hexToRgba(colors.BR_BLUE, 0.56), // 'rgba(32, 147, 266, 0.56)',
    bottomColor: colors.hexToRgba(colors.BR_BLUE, 0.04), // 'rgba(32, 147, 266, 0.04)',
    lineColor: colors.hexToRgba(colors.BR_BLUE, 1), // 'rgba(32, 147, 266, 1)',
  },
};

const formatter = Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
});

const priceFormatter = (priceValue: number) =>
  formatter.format(priceValue / 100);

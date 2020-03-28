import * as React from 'react';

import * as colors from '../colors';
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

  const [frequency, setFrequency] = React.useState(ChartSampleSize.Month);

  const onClickHandler = (sampleSize: ChartSampleSize) => () => {
    setFrequency(sampleSize);
    renderChart(accountId, sampleSize);
  };

  return (
    <div style={containerStyle}>
      {frequencies.map(({ label, value }) => (
        <Toggle
          isSelected={frequency === value}
          key={value}
          onClick={onClickHandler(value)}
          style={{ cursor: 'pointer' }}
        >
          {label}
        </Toggle>
      ))}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
};

type ToggleProps = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & {
  isSelected: boolean;
};

function Toggle({ children, isSelected, style, ...props }: ToggleProps) {
  const dynamicStyle = isSelected
    ? toggleButtonSelectedStyle
    : toggleButtonStyle;

  return (
    <div style={{ ...dynamicStyle, ...style }} {...props}>
      {children}
    </div>
  );
}

const toggleButtonStyle: React.CSSProperties = {
  border: '2px solid transparent',
  borderTopColor: 'transparent',
  fontWeight: 700,
  fontSize: '12px',
  padding: '8px 16px',
};

const toggleButtonSelectedStyle: React.CSSProperties = {
  ...toggleButtonStyle,
  borderTopColor: colors.WHITE,
};

const frequencies = [
  { label: 'Daily', value: ChartSampleSize.Day },
  { label: 'Weekly', value: ChartSampleSize.Week },
  { label: 'Monthly', value: ChartSampleSize.Month },
  { label: 'Yearly', value: ChartSampleSize.Year },
];

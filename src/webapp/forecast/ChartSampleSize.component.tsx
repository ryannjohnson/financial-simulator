import * as React from 'react';

import * as colors from '../colors';
import * as actions from '../redux/actions';
import { ChartSampleSize } from '../redux/reducer/forecast/props';

type Props = {
  accountId: string | null;
  selected: ChartSampleSize;
  setValue: typeof actions.forecast.setTimelineChartSampleSize;
};

export default function ChartSampleSizeComponent({
  accountId,
  selected,
  setValue,
}: Props) {
  if (!accountId) {
    return null;
  }

  const onClickHandler = (sampleSize: ChartSampleSize) => () =>
    setValue(sampleSize);

  return (
    <div style={containerStyle}>
      {frequencies.map(({ label, value }) => (
        <Toggle
          isSelected={selected === value}
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
  height: '100%',
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
  alignItems: 'center',
  border: '2px solid transparent',
  borderTopColor: 'transparent',
  boxSizing: 'border-box',
  display: 'flex',
  fontWeight: 700,
  fontSize: '12px',
  height: '100%',
  opacity: 0.5,
  padding: '0 16px',
};

const toggleButtonSelectedStyle: React.CSSProperties = {
  ...toggleButtonStyle,
  borderTopColor: colors.WHITE,
  opacity: 1,
};

const frequencies = [
  { label: 'Daily', value: ChartSampleSize.Day },
  { label: 'Weekly', value: ChartSampleSize.Week },
  { label: 'Monthly', value: ChartSampleSize.Month },
  { label: 'Yearly', value: ChartSampleSize.Year },
];

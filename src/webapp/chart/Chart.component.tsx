import * as React from 'react';

type Props = {
  values: number[];
};

type State = {
  height: number;
  width: number;
};

export default class ChartComponent extends React.Component<Props, State> {
  private canvasRef: HTMLCanvasElement | null = null;
  private containerRef: HTMLDivElement | null = null;
  private containerResizeHandler: (() => void) | null = null;

  state = {
    height: 0,
    width: 0,
  };

  componentDidMount() {
    this.containerResizeHandler = () => {
      const height = this.containerRef!.offsetHeight;
      const width = this.containerRef!.offsetWidth;
      this.setState({ height, width });
    };

    window.addEventListener('resize', this.containerResizeHandler);

    this.containerResizeHandler();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.containerResizeHandler!);
  }

  componentDidUpdate() {
    const ctx = this.canvasRef!.getContext('2d')!;

    const padding = 30;

    drawChart(ctx, this.props.values, {
      top: padding,
      left: padding,
      right: this.state.width - padding,
      bottom: this.state.height - padding,
    });
  }

  render() {
    return (
      <div ref={ref => (this.containerRef = ref)} style={containerStyle}>
        <canvas
          ref={ref => (this.canvasRef = ref)}
          height={this.state.height}
          style={canvasStyle}
          width={this.state.width}
        />
      </div>
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

const canvasStyle: React.CSSProperties = {
  position: 'absolute',
  top: 0,
  left: 0,
};

type DrawChartSettings = {
  top: number;
  left: number;
  right: number;
  bottom: number;
};

function drawChart(
  ctx: CanvasRenderingContext2D,
  values: number[],
  { bottom, left, right, top }: DrawChartSettings,
) {
  const height = bottom - top;
  const width = right - left;
  const widthPerPoint = width / (values.length - 1);

  let minValue = 0;
  let maxValue = 0;
  for (const value of values) {
    minValue = Math.min(minValue, value);
    maxValue = Math.max(maxValue, value);
  }

  let verticalRange = maxValue - minValue;
  if (minValue < 0) {
    minValue -= verticalRange / 8;
  }
  if (maxValue > 0) {
    maxValue += verticalRange / 8;
  }
  verticalRange = maxValue - minValue;

  const heightPerValue = height / verticalRange;

  ctx.clearRect(left, top, right, bottom);

  ctx.strokeStyle = 'rgb(200, 0, 0)';
  ctx.beginPath();
  const startingHeight = bottom - (values[0] - minValue) * heightPerValue;
  ctx.moveTo(left, startingHeight);
  for (let i = 1; i < values.length; i++) {
    const value = values[i];
    const x0 = i * widthPerPoint + left;
    const y0 = bottom - (value - minValue) * heightPerValue;
    ctx.lineTo(x0, y0);
  }
  ctx.stroke();

  ctx.fillStyle = 'rgb(0, 0, 200)';
  ctx.fillRect(left, top, width, 1);
  ctx.fillRect(left, top, 1, height);
  ctx.fillRect(left, bottom - 1, width, 1);
  ctx.fillRect(right - 1, top, 1, height);

  const zeroHeight = bottom - (top - minValue) * heightPerValue;
  ctx.fillRect(top, zeroHeight, width, 0.5);
}

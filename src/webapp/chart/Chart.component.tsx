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

    this.containerRef!.addEventListener('resize', this.containerResizeHandler);

    this.containerResizeHandler();
  }

  componentWillUnmount() {
    this.containerRef!.removeEventListener(
      'resize',
      this.containerResizeHandler!,
    );
  }

  componentDidUpdate() {
    const ctx = this.canvasRef!.getContext('2d')!;

    ctx.clearRect(0, 0, this.state.width, this.state.height);
    ctx.strokeStyle = 'rgb(200, 0, 0)';

    const widthPerPoint = this.state.width / this.props.values.length;

    let minValue = 0;
    let maxValue = 0;
    for (const value of this.props.values) {
      minValue = Math.min(minValue, value);
      maxValue = Math.max(maxValue, value);
    }
    const heightPerValue = this.state.height / (maxValue - minValue);

    ctx.beginPath();
    const startingHeight =
      this.state.height - (this.props.values[0] - minValue) * heightPerValue;
    ctx.moveTo(0, startingHeight);
    for (let i = 1; i < this.props.values.length; i++) {
      const value = this.props.values[i];
      const x0 = i * widthPerPoint;
      const y0 = this.state.height - (value - minValue) * heightPerValue;
      ctx.lineTo(x0, y0);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgb(0, 0, 200)';
    ctx.fillRect(0, 0, this.state.width, 1);
    ctx.fillRect(0, 0, 1, this.state.height);
    ctx.fillRect(0, this.state.height - 1, this.state.width, 1);
    ctx.fillRect(this.state.width - 1, 0, 1, this.state.height);

    const zeroHeight = this.state.height - (0 - minValue) * heightPerValue;
    ctx.fillRect(0, zeroHeight, this.state.width, 0.5);
  }

  render() {
    return (
      <div ref={ref => (this.containerRef = ref)} style={containerStyle}>
        <canvas
          ref={ref => (this.canvasRef = ref)}
          height={this.state.height}
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

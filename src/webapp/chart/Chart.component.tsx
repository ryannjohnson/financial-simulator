import * as React from 'react';

type Props = {
  height: number;
  values: number[];
  width: number;
};

export default class ChartComponent extends React.Component<Props> {
  private ref: HTMLCanvasElement | null = null;

  componentDidMount() {
    const ctx = this.ref!.getContext('2d')!;

    ctx.clearRect(0, 0, this.props.width, this.props.height);
    ctx.strokeStyle = 'rgb(200, 0, 0)';

    const widthPerPoint = this.props.width / this.props.values.length;

    let minValue = 0;
    let maxValue = 0;
    for (const value of this.props.values) {
      minValue = Math.min(minValue, value);
      maxValue = Math.max(maxValue, value);
    }
    const heightPerValue = this.props.height / (maxValue - minValue);

    ctx.beginPath();
    const startingHeight =
      this.props.height - (this.props.values[0] - minValue) * heightPerValue;
    ctx.moveTo(0, startingHeight);
    for (let i = 1; i < this.props.values.length; i++) {
      const value = this.props.values[i];
      const x0 = i * widthPerPoint;
      const y0 = this.props.height - (value - minValue) * heightPerValue;
      ctx.lineTo(x0, y0);
    }
    ctx.stroke();

    ctx.fillStyle = 'rgb(0, 0, 200)';
    ctx.fillRect(0, 0, this.props.width, 1);
    ctx.fillRect(0, 0, 1, this.props.height);
    ctx.fillRect(0, this.props.height - 1, this.props.width, 1);
    ctx.fillRect(this.props.width - 1, 0, 1, this.props.height);

    const zeroHeight = this.props.height - (0 - minValue) * heightPerValue;
    ctx.fillRect(0, zeroHeight, this.props.width, 0.5);
  }

  render() {
    return (
      <canvas
        ref={ref => (this.ref = ref)}
        height={this.props.height}
        width={this.props.width}
      />
    );
  }
}

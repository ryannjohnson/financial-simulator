import * as React from 'react';

import { CalendarDate, CalendarDateJSON } from '../../../calendar-date';
import * as actions from '../../redux/actions';

type Props = {
  endsOn: CalendarDateJSON | null;
  eventId: string;
  setEventCalendarDates: typeof actions.forecast.setEventCalendarDates;
  startsOn: CalendarDateJSON;
  timelineEndsOn: CalendarDateJSON;
  timelineStartsOn: CalendarDateJSON;
};

type State = {
  clickedWith: {
    endsOn: CalendarDateJSON | null;
    page: Point;
    startsOn: CalendarDateJSON;
  } | null;
};

type Point = {
  x: number;
  y: number;
};

export default class SpanComponent extends React.Component<Props, State> {
  private moverRef: HTMLDivElement | null = null;

  state: State = {
    clickedWith: null,
  };

  componentDidMount() {
    this.moverRef!.addEventListener('mousedown', this.moverMouseDownHandler);
    window.addEventListener('mousemove', this.moverMouseMoveHandler);
    window.addEventListener('mouseup', this.moverMouseUpHandler);
  }

  componentWillUnmount() {
    this.moverRef!.removeEventListener('mousedown', this.moverMouseDownHandler);
    window.removeEventListener('mousemove', this.moverMouseMoveHandler);
    window.removeEventListener('mouseup', this.moverMouseUpHandler);
  }

  getTimelineStats() {
    const startsOn = CalendarDate.fromJSON(this.props.timelineStartsOn);
    const endsOn = CalendarDate.fromJSON(this.props.timelineEndsOn);
    const days = startsOn.daysBefore(endsOn) + 1;
    return { days, endsOn, startsOn };
  }

  moverMouseDownHandler = (event: MouseEvent) => {
    this.setState({
      clickedWith: {
        endsOn: this.props.endsOn,
        page: {
          x: event.pageX,
          y: event.pageY,
        },
        startsOn: this.props.startsOn,
      },
    });
  };

  moverMouseMoveHandler = (event: MouseEvent) => {
    if (!this.state.clickedWith) {
      return;
    }

    const { endsOn, page, startsOn } = this.state.clickedWith;
    const spanContainer = this.moverRef!.parentElement!.parentElement!;
    const timelineWidth = spanContainer.offsetWidth;
    const { days: timelineDays } = this.getTimelineStats();

    const daysPerPixel = timelineDays / timelineWidth;
    const dx = event.pageX - page.x;
    const days = Math.round(dx * daysPerPixel);

    const startsOnCalendarDate = CalendarDate.fromJSON(startsOn).addDays(days);
    const endsOnCalendarDate = endsOn
      ? CalendarDate.fromJSON(endsOn).addDays(days)
      : null;

    this.props.setEventCalendarDates(
      this.props.eventId,
      startsOnCalendarDate,
      endsOnCalendarDate,
    );
  };

  moverMouseUpHandler = (_: MouseEvent) => {
    this.setState({
      clickedWith: null,
    });
  };

  render() {
    const { endsOn: endsOnJSON, startsOn: startsOnJSON } = this.props;

    const timeline = this.getTimelineStats();

    const startsOn = CalendarDate.fromJSON(startsOnJSON);
    const endsOn = endsOnJSON ? CalendarDate.fromJSON(endsOnJSON) : null;
    const spanDays = startsOn.daysBefore(endsOn || timeline.endsOn) + 1;
    const spanStartsOnDay = timeline.startsOn.daysBefore(startsOn);

    const spanLeft = spanStartsOnDay / timeline.days;
    const spanWidth = spanDays / timeline.days;

    const dynamicContainerStyle = {
      left: `${spanLeft * 100}%`,
      width: `${spanWidth * 100}%`,
    };

    return (
      <div style={{ ...containerStyle, ...dynamicContainerStyle }}>
        <div ref={ref => (this.moverRef = ref)} style={moverStyle}></div>
        <div></div>
      </div>
    );
  }
}

const containerStyle: React.CSSProperties = {
  background: 'rgb(127, 127, 255)',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  minWidth: '1px',
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
};

const moverStyle: React.CSSProperties = {
  background: 'rgba(0, 0, 0, 0.1)',
  cursor: 'grab',
  height: '50%',
};

import * as React from 'react';

import { CalendarDate, CalendarDateJSON } from '../../../calendar-date';
import * as colors from '../../colors';
import * as actions from '../../redux/actions';
import { TrackItem, TrackItemType } from '../../redux/reducer/forecast/props';
import { TRACK_PIXEL_HEIGHT } from './constants';

// Number of pixels to try to stick handles to.
const STICKY_PIXELS = 10;

type Props = {
  accountId: string;
  endsOn: CalendarDateJSON | null;
  isSelected: boolean;
  label: string;
  selectTrackItem: typeof actions.forecast.selectTrackItem;
  setCalendarDates: typeof actions.forecast.setTrackItemCalendarDates;
  setEndsOn: typeof actions.forecast.setTrackItemEndsOn;
  setStartsOn: typeof actions.forecast.setTrackItemStartsOn;
  startsOn: CalendarDateJSON | null;
  timelineEndsOn: CalendarDateJSON;
  timelineStartsOn: CalendarDateJSON;
  trackIndex: number;
  id: string;
  type: TrackItemType;
};

type State = {
  mouseDownDetails: {
    clickTarget: ClickTarget;
    containerOffsetLeft: number;
    endsOn: CalendarDateJSON | null;
    page: Point;
    startsOn: CalendarDateJSON | null;
  } | null;
};

type Point = {
  x: number;
  y: number;
};

enum ClickTarget {
  Grab,
  LeftHandle,
  RightHandle,
}

export default class SpanComponent extends React.Component<Props, State> {
  private containerRef: HTMLDivElement | null = null;
  private grabRef: HTMLDivElement | null = null;
  private leftHandleRef: HTMLDivElement | null = null;
  private rightHandleRef: HTMLDivElement | null = null;

  state: State = {
    mouseDownDetails: null,
  };

  componentDidMount() {
    this.containerRef!.addEventListener(
      'mousedown',
      this.containerMouseDownHandler,
    );
    this.grabRef!.addEventListener('mousedown', this.grabMouseDownHandler);
    this.leftHandleRef!.addEventListener(
      'mousedown',
      this.leftHandleMouseDownHandler,
    );
    this.rightHandleRef!.addEventListener(
      'mousedown',
      this.rightHandleMouseDownHandler,
    );
    window.addEventListener('mousemove', this.mouseMoveHandler);
    window.addEventListener('mouseup', this.mouseUpHandler);
  }

  componentWillUnmount() {
    this.containerRef!.removeEventListener(
      'mousedown',
      this.containerMouseDownHandler,
    );
    this.grabRef!.removeEventListener('mousedown', this.grabMouseDownHandler);
    this.leftHandleRef!.removeEventListener(
      'mousedown',
      this.leftHandleMouseDownHandler,
    );
    this.rightHandleRef!.removeEventListener(
      'mousedown',
      this.rightHandleMouseDownHandler,
    );
    window.removeEventListener('mousemove', this.mouseMoveHandler);
    window.removeEventListener('mouseup', this.mouseUpHandler);
  }

  getTimelineBox() {
    // WARNING: This is brittle as it has knowledge of the timeline
    // around it.
    //
    // TODO: Is there a better way to do this?
    const timelineElement = this.containerRef!.parentElement!;
    return timelineElement.getBoundingClientRect();
  }

  getTimelineStats() {
    const startsOn = CalendarDate.fromJSON(this.props.timelineStartsOn);
    const endsOn = CalendarDate.fromJSON(this.props.timelineEndsOn);
    const days = startsOn.daysBefore(endsOn) + 1;
    return { days, endsOn, startsOn };
  }

  containerMouseDownHandler = (_: MouseEvent) => {
    const trackItem: TrackItem = {
      id: this.props.id,
      type: this.props.type,
    };
    this.props.selectTrackItem(trackItem);
  };

  grabMouseDownHandler = (event: MouseEvent) => {
    this.setState(this.toMouseDownState(event, ClickTarget.Grab));
  };

  leftHandleMouseDownHandler = (event: MouseEvent) => {
    this.setState(this.toMouseDownState(event, ClickTarget.LeftHandle));
  };

  rightHandleMouseDownHandler = (event: MouseEvent) => {
    this.setState(this.toMouseDownState(event, ClickTarget.RightHandle));
  };

  toMouseDownState = (event: MouseEvent, clickTarget: ClickTarget) => {
    return {
      mouseDownDetails: {
        clickTarget,
        containerOffsetLeft: this.containerRef!.offsetLeft,
        endsOn: this.props.endsOn,
        page: {
          x: event.pageX,
          y: event.pageY,
        },
        startsOn: this.props.startsOn,
      },
    };
  };

  mouseMoveHandler = (event: MouseEvent) => {
    if (!this.state.mouseDownDetails) {
      return;
    }

    const {
      clickTarget,
      containerOffsetLeft,
      endsOn: endsOnJSON,
      page,
      startsOn: startsOnJSON,
    } = this.state.mouseDownDetails;
    const startsOn = startsOnJSON ? CalendarDate.fromJSON(startsOnJSON) : null;
    const timelineElement = this.containerRef!.parentElement!;
    const timelineWidth = timelineElement.offsetWidth;
    const {
      days: timelineDays,
      endsOn: timelineEndsOn,
      startsOn: timelineStartsOn,
    } = this.getTimelineStats();

    const daysPerPixel = timelineDays / timelineWidth;
    const dx = event.pageX - page.x;
    let days = Math.round(dx * daysPerPixel);

    const tryToStickToTimelineStartsOn = () => {
      // Closure because of the amount of context required.
      if (startsOn) {
        const resultingX = containerOffsetLeft + dx;
        if (resultingX < STICKY_PIXELS / 2 && resultingX > -STICKY_PIXELS / 2) {
          days = timelineStartsOn.daysAfter(startsOn);
        }
      }
    };

    const trackItem: TrackItem = {
      id: this.props.id,
      type: this.props.type,
    };

    if (clickTarget === ClickTarget.Grab) {
      tryToStickToTimelineStartsOn();

      const timelineBox = this.getTimelineBox();
      const offsetY = event.pageY - timelineBox.y;
      const trackIndex = Math.floor(offsetY / TRACK_PIXEL_HEIGHT);

      let newStartsOn = startsOn ? startsOn.addDays(days) : null;
      if (newStartsOn === null && this.props.type === TrackItemType.Event) {
        newStartsOn = timelineStartsOn.addDays(days);
      }

      const newEndsOn = endsOnJSON
        ? CalendarDate.fromJSON(endsOnJSON).addDays(days)
        : null;

      this.props.setCalendarDates(
        this.props.accountId,
        trackItem,
        trackIndex,
        newStartsOn,
        newEndsOn,
      );
    }

    if (clickTarget === ClickTarget.LeftHandle) {
      tryToStickToTimelineStartsOn();

      const newStartsOn = startsOn
        ? startsOn.addDays(days)
        : timelineStartsOn.addDays(days);
      this.props.setStartsOn(this.props.accountId, trackItem, newStartsOn);
    }

    if (clickTarget === ClickTarget.RightHandle) {
      const newEndsOn = endsOnJSON
        ? CalendarDate.fromJSON(endsOnJSON).addDays(days)
        : timelineEndsOn.addDays(days);
      this.props.setEndsOn(this.props.accountId, trackItem, newEndsOn);
    }
  };

  mouseUpHandler = (_: MouseEvent) => {
    this.setState({
      mouseDownDetails: null,
    });
  };

  render() {
    const {
      endsOn: endsOnJSON,
      startsOn: startsOnJSON,
      timelineStartsOn,
    } = this.props;

    const timeline = this.getTimelineStats();

    const startsOn = CalendarDate.fromJSON(startsOnJSON || timelineStartsOn);
    const endsOn = endsOnJSON ? CalendarDate.fromJSON(endsOnJSON) : null;
    const spanDays = startsOn.daysBefore(endsOn || timeline.endsOn) + 1;
    const spanStartsOnDay = timeline.startsOn.daysBefore(startsOn);

    const spanLeft = spanStartsOnDay / timeline.days;
    const spanWidth = spanDays / timeline.days;

    const dynamicContainerStyle: React.CSSProperties = {
      left: `${spanLeft * 100}%`,
      top: `${this.props.trackIndex * TRACK_PIXEL_HEIGHT}px`,
      width: `${spanWidth * 100}%`,
    };

    const dynamicSelectedStyle: React.CSSProperties = this.props.isSelected
      ? selectedStyle
      : {};

    return (
      <div
        ref={ref => (this.containerRef = ref)}
        style={{ ...containerStyle, ...dynamicContainerStyle }}
      >
        <div
          ref={ref => (this.grabRef = ref)}
          style={{ ...grabStyle, ...dynamicSelectedStyle }}
        >
          {this.props.label}
        </div>
        <div style={bottomStyle}>
          <div
            ref={ref => (this.leftHandleRef = ref)}
            style={{ ...leftHandleStyle, ...dynamicSelectedStyle }}
          />
          <div
            ref={ref => (this.rightHandleRef = ref)}
            style={{ ...rightHandleStyle, ...dynamicSelectedStyle }}
          />
        </div>
      </div>
    );
  }
}

const unselectedStyle: React.CSSProperties = {
  background: 'rgba(0, 0, 0, 0.1)',
};

const containerStyle: React.CSSProperties = {
  background: 'rgb(127, 127, 255)',
  borderRadius: '5px',
  display: 'flex',
  flexDirection: 'column',
  height: `${TRACK_PIXEL_HEIGHT}px`,
  minWidth: '1px',
  overflow: 'hidden',
  position: 'absolute',
  top: 0,
  userSelect: 'none',
};

const grabStyle: React.CSSProperties = {
  ...unselectedStyle,
  alignItems: 'center',
  boxSizing: 'border-box',
  color: colors.WHITE,
  cursor: 'grab',
  display: 'flex',
  flexDirection: 'row',
  fontSize: '11px',
  height: '50%',
  paddingLeft: '5px',
  whiteSpace: 'nowrap',
  zIndex: 10,
};

const bottomStyle: React.CSSProperties = {
  flexGrow: 1,
  position: 'relative',
  zIndex: 1,
};

const handleStyle: React.CSSProperties = {
  ...unselectedStyle,
  bottom: 0,
  height: '100%',
  position: 'absolute',
  width: '5px',
};

const leftHandleStyle: React.CSSProperties = {
  ...handleStyle,
  cursor: 'w-resize',
  left: 0,
  zIndex: 4,
};

const rightHandleStyle: React.CSSProperties = {
  ...handleStyle,
  cursor: 'e-resize',
  right: 0,
  zIndex: 5,
};

const selectedStyle: React.CSSProperties = {
  background: 'rgba(0, 0, 0, 0.25)',
};

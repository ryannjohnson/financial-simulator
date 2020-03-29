import classnames from 'classnames';
import * as React from 'react';

import { CalendarDate, CalendarDateJSON } from '../../../calendar-date';
import * as actions from '../../redux/actions';
import { TrackItem, TrackItemType } from '../../redux/reducer/forecast/props';
import { Orientation } from '../../redux/selectors/forecast';
import { TRACK_PIXEL_HEIGHT } from './constants';
import styles from './Span.css';

// Number of pixels to try to stick handles to.
const STICKY_PIXELS = 10;

type Props = {
  accountId: string;
  endsOn: CalendarDateJSON | null;
  isSelected: boolean;
  name: string;
  orientation: Orientation;
  selectTrackItem: typeof actions.forecast.selectTrackItem;
  setCalendarDates: typeof actions.forecast.setTrackItemCalendarDates;
  setEndsOn: typeof actions.forecast.setTrackItemEndsOn;
  setStartsOn: typeof actions.forecast.setTrackItemStartsOn;
  shortDescription: string;
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

    const selected = this.props.isSelected ? styles.selected : null;

    let trackItemTypeClassNames = [
      styles[`type-${this.props.type}`],
      styles[`type-${this.props.type}-${this.props.orientation}`],
    ];

    return (
      <div
        className={classnames(styles.container, ...trackItemTypeClassNames)}
        ref={ref => (this.containerRef = ref)}
        style={{ ...dynamicContainerStyle }}
      >
        <div
          className={classnames(styles['move-handle'], selected)}
          ref={ref => (this.grabRef = ref)}
        >
          {this.props.name !== '' ? (
            <span className={styles.name}>{this.props.name}</span>
          ) : (
            ''
          )}
          <em>{this.props.shortDescription}</em>
        </div>
        <div className={styles.bottom}>
          <div
            className={classnames(styles['left-date-handle'], selected)}
            ref={ref => (this.leftHandleRef = ref)}
          />
          <div
            className={classnames(styles['right-date-handle'], selected)}
            ref={ref => (this.rightHandleRef = ref)}
          />
        </div>
      </div>
    );
  }
}

import * as React from 'react';

import { generateLocalUUID } from '../../../utils';
import * as actions from '../../redux/actions';
import { TrackItem } from '../../redux/reducer/forecast/props';
import styles from './Timeline.css';
import SpanContainer from './Span.container';

type Props = {
  accountId: string;
  addTrack: typeof actions.forecast.addTrack;
  selectTrackItem: typeof actions.forecast.selectTrackItem;
  trackIds: string[];
  trackItems: TrackItem[];
};

export default class TimelineComponent extends React.Component<Props> {
  private tracksContainerRef: HTMLDivElement | null = null;

  componentDidMount() {
    this.tracksContainerRef!.addEventListener(
      'click',
      this.deselectTrackItemHandler,
    );
  }

  componentWillUnount() {
    this.tracksContainerRef!.removeEventListener(
      'click',
      this.deselectTrackItemHandler,
    );
  }

  addTrackHandler = () => {
    this.props.addTrack(this.props.accountId, {
      id: generateLocalUUID(),
      name: '',
      items: [],
    });
  };

  deselectTrackItemHandler = (_: MouseEvent) => {
    this.props.selectTrackItem(null);
  };

  render() {
    const { trackIds, trackItems } = this.props;

    return (
      <div className={styles.container}>
        {/* <div className={styles['headers-container']}>
          {trackIds.map((_, i) => (
            <div key={i} className={styles['header-track']}>
              {i + 1}
            </div>
          ))}
          <div className={styles['header-track']}>
            <button
              className={styles['add-button']}
              onClick={this.addTrackHandler}
            >
              +
            </button>
          </div>
        </div> */}
        <div
          className={styles['tracks-container']}
          ref={ref => (this.tracksContainerRef = ref)}
        >
          {trackIds.map((_, i) => (
            <div key={i} className={styles.track} />
          ))}
          <div className={styles['tracks-buffer']}>
            <button
              className={styles['add-button']}
              onClick={this.addTrackHandler}
            >
              + Add row
            </button>
          </div>
          <div className={styles['spans-container']}>
            {trackItems.map(({ id, type }) => (
              <SpanContainer id={id} key={`${type}-${id}`} type={type} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}

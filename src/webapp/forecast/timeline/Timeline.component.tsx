import * as React from 'react';

import { generateLocalUUID } from '../../../utils';
import * as colors from '../../colors';
import * as actions from '../../redux/actions';
import { TrackItem } from '../../redux/reducer/forecast/props';
import { TRACK_PIXEL_HEIGHT } from './constants';
import styles from './Timeline.css';
import SpanContainer from './Span.container';

type Props = {
  accountId: string;
  addTrack: typeof actions.forecast.addTrack;
  trackIds: string[];
  trackItems: TrackItem[];
};

export default function TimelineComponent({
  accountId,
  addTrack,
  trackIds,
  trackItems,
}: Props) {
  const addTrackHandler = () => {
    addTrack(accountId, {
      id: generateLocalUUID(),
      name: 'TODO: Add name',
      items: [],
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles['headers-container']}>
        {trackIds.map((_, i) => (
          <div key={i} className={styles['header-track']}>
            {i + 1}
          </div>
        ))}
        <div className={styles['header-track']}>
          <button className={styles['add-button']} onClick={addTrackHandler}>
            +
          </button>
        </div>
      </div>
      <div className={styles['tracks-container']}>
        {trackIds.map((_, i) => (
          <div key={i} className={styles.track} />
        ))}
        <div className={styles['tracks-buffer']}></div>
        <div className={styles['spans-container']}>
          {trackItems.map(({ id, type }) => (
            <SpanContainer id={id} key={`${type}-${id}`} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

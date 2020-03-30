import * as React from 'react';

import ChartFrameContainer from './ChartFrame.container';
import styles from './Forecast.css';
import InspectorContainer from './Inspector.container';
import TimelineFrameContainer from './timeline/TimelineFrame.container';

export default function ForecastComponent() {
  return (
    <div className={styles.container}>
      <div className={styles['left-sidebar-container']}></div>
      <div className={styles['main-container']}>
        <div className={styles['top-container']}>
          <div className={styles['inspector-container']}>
            <InspectorContainer />
          </div>
          <div className={styles['chart-container']}>
            <ChartFrameContainer />
          </div>
        </div>
        <div className={styles['timeline-frame-container']}>
          <TimelineFrameContainer />
        </div>
      </div>
    </div>
  );
}

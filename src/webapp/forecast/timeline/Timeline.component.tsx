import * as React from 'react';

import { generateLocalUUID } from '../../../utils';
import * as colors from '../../colors';
import * as actions from '../../redux/actions';
import { TrackItem } from '../../redux/reducer/forecast/props';
import { TRACK_PIXEL_HEIGHT } from './constants';
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
    <div style={containerStyle}>
      <div style={headersContainerStyle}>
        {trackIds.map(trackId => (
          <div key={trackId} style={trackContainerStyle}>
            <div style={trackHeaderStyle}>TODO: Add name</div>
          </div>
        ))}
        <div>
          <button onClick={addTrackHandler}>+ Add track</button>
        </div>
      </div>
      <div style={tracksContainerStyle}>
        {trackIds.map((_, i) => (
          <div key={i} style={trackContainerStyle}>
            <div style={trackBodyStyle} />
          </div>
        ))}
        <div style={spansContainerStyle}>
          {trackItems.map(({ id, type }) => (
            <SpanContainer id={id} key={`${type}-${id}`} type={type} />
          ))}
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'row',
  minHeight: '100%',
  overflowX: 'hidden',
  overflowY: 'auto',
  position: 'absolute',
  width: '100%',
};

const headersContainerStyle: React.CSSProperties = {
  background: colors.whiteOverlay(5),
  color: colors.WHITE,
  width: '275px',
};

const tracksContainerStyle: React.CSSProperties = {
  flexGrow: 1,
  overflow: 'hidden',
  position: 'relative',
  zIndex: 5,
};

const trackContainerStyle: React.CSSProperties = {
  alignItems: 'center',
  borderBottom: `solid ${colors.whiteOverlay(2)} 0.5px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  height: `${TRACK_PIXEL_HEIGHT}px`,
};

const trackHeaderStyle: React.CSSProperties = {
  width: '200px',
};

const trackBodyStyle: React.CSSProperties = {
  height: '100%',
  position: 'relative',
  width: '100%',
};

const spansContainerStyle: React.CSSProperties = {
  height: '100%',
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
};

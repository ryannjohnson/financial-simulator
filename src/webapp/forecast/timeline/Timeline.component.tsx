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
          <div key={trackId} style={headerContainerStyle}>
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
        <div style={tracksBufferStyle} />
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
  height: '100%',
  overflowX: 'hidden',
  overflowY: 'scroll',
  position: 'absolute',
  width: '100%',
};

const rowStyle: React.CSSProperties = {
  alignItems: 'center',
  borderBottom: `solid ${colors.LIGHTBLACK2} 0.5px`,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'row',
  height: `${TRACK_PIXEL_HEIGHT}px`,
};

const headersContainerStyle: React.CSSProperties = {
  background: colors.BLACK,
  color: colors.WHITE,
  position: 'relative',
  width: '275px',
  zIndex: 6,
};

const headerContainerStyle: React.CSSProperties = {
  ...rowStyle,
};

const tracksContainerStyle: React.CSSProperties = {
  flexGrow: 1,
  position: 'relative',
  zIndex: 5,
};

const trackContainerStyle: React.CSSProperties = {
  ...rowStyle,
  background: colors.DARKBLACK,
};

const tracksBufferStyle: React.CSSProperties = {
  background: colors.DARKBLACK,
  height: 'calc(100% - 50px)',
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
  left: 0,
  position: 'absolute',
  top: 0,
  width: '100%',
};

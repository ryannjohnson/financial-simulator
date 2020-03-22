import * as React from 'react';

import SpanContainer from './Span.container';

type Props = {
  eventIds: string[];
  name: string;
  trackId: string;
};

export default function TrackComponent({ eventIds, name }: Props) {
  return (
    <div style={containerStyle}>
      <div style={headerStyle}>{name}</div>
      <div style={trackStyle}>
        {eventIds.map(eventId => {
          return <SpanContainer key={eventId} eventId={eventId} />;
        })}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  flexDirection: 'row',
  height: '50px',
};

const headerStyle: React.CSSProperties = {
  width: '200px',
};

const trackStyle: React.CSSProperties = {
  height: '100%',
  position: 'relative',
  width: '100%',
};

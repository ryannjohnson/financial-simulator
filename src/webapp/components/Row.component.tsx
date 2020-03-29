import * as React from 'react';

export default function Row({ children }: { children: React.ReactNode }) {
  return <div style={rowStyle}>{children}</div>;
}

const rowStyle: React.CSSProperties = {
  alignItems: 'stretch',
  display: 'flex',
  flexDirection: 'row',
  margin: '0 -.25em',
};

import * as React from 'react';

export default function RowItem({ children }: { children: React.ReactNode }) {
  return <div style={rowItemStyle}>{children}</div>;
}

const rowItemStyle: React.CSSProperties = {
  margin: '0 .25em',
};

import * as React from 'react';

type Props = {
  children: React.ReactNode;
  title: string;
};

export default function FormElementComponent({ children, title }: Props) {
  return (
    <div style={containerStyle}>
      <div style={titleStyle}>{title}</div>
      <div>{children}</div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  padding: '.5em 0',
};

const titleStyle: React.CSSProperties = {
  fontStyle: 'bold',
  paddingBottom: '.25em',
};

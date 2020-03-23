import * as React from 'react';

type Props = {
  setValue: (value: string) => void;
  value: string;
};

export default function StringComponent({ setValue, value }: Props) {
  return (
    <input
      onChange={event => setValue(event.target.value)}
      type="text"
      value={value}
    />
  );
}

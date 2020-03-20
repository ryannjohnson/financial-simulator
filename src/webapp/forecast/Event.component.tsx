import * as React from 'react';

import { EventJSON } from '../../timeline';

type Props = EventJSON;

export default function EventsComponent({ formulaType }: Props) {
  return <li>{formulaType}</li>;
}

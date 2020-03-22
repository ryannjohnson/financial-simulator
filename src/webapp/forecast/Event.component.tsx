import * as React from 'react';

import { CalendarDate } from '../../calendar-date';
import * as timeline from '../../timeline';
import CalendarDateComponent from '../components/CalendarDate.component';
import NullableCalendarDateComponent from '../components/NullableCalendarDate.component';
import FormElementComponent from '../components/FormElement.component';
import FormulaComponent from './formula/Formula.component';

type Props = timeline.EventJSON & {
  eventId: string;
  removeEvent: (id: string) => void;
  setEvent: (id: string, event: timeline.Event) => void;
};

export default function EventComponent({
  endsOn,
  eventId,
  formula,
  formulaType,
  removeEvent,
  setEvent,
  startsOn,
}: Props) {
  return (
    <div>
      <div>
        <button onClick={() => removeEvent(eventId)}>Remove</button>{' '}
        {formulaType}
      </div>
      <Row>
        <RowItem>
          <FormElementComponent title="Starts">
            <CalendarDateComponent
              setValue={value => {
                if (endsOn) {
                  if (CalendarDate.fromJSON(endsOn).daysBefore(value) > 0) {
                    endsOn = value.toJSON();
                  }
                }
                setEvent(
                  eventId,
                  timeline.Event.fromJSON({
                    endsOn,
                    formula,
                    formulaType,
                    startsOn: value.toJSON(),
                  }),
                );
              }}
              value={startsOn}
            />
          </FormElementComponent>
        </RowItem>
        <RowItem>
          <FormElementComponent title="Ends">
            <NullableCalendarDateComponent
              setValue={value => {
                if (value) {
                  if (CalendarDate.fromJSON(startsOn).daysAfter(value) > 0) {
                    startsOn = value.toJSON();
                  }
                }
                setEvent(
                  eventId,
                  timeline.Event.fromJSON({
                    endsOn: value ? value.toJSON() : null,
                    formula,
                    formulaType,
                    startsOn,
                  }),
                );
              }}
              value={endsOn}
            />
          </FormElementComponent>
        </RowItem>
      </Row>
      <FormulaComponent
        formula={formula}
        formulaType={formulaType}
        setFormula={value => {
          setEvent(
            eventId,
            timeline.Event.fromJSON({
              endsOn,
              formula: value.toJSON(),
              formulaType,
              startsOn,
            }),
          );
        }}
      />
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div style={rowStyle}>{children}</div>;
}

const rowStyle: React.CSSProperties = {
  alignItems: 'stretch',
  display: 'flex',
  flexDirection: 'row',
  margin: '0 -.25em',
};

function RowItem({ children }: { children: React.ReactNode }) {
  return <div style={rowItemStyle}>{children}</div>;
}

const rowItemStyle: React.CSSProperties = {
  margin: '0 .25em',
};

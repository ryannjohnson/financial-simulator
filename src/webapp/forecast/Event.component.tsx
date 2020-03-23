import * as React from 'react';

import { CalendarDate } from '../../calendar-date';
import * as timeline from '../../timeline';
import CalendarDateComponent from '../components/CalendarDate.component';
import StringComponent from '../components/String.component';
import NullableCalendarDateComponent from '../components/NullableCalendarDate.component';
import FormElementComponent from '../components/FormElement.component';
import Row from './components/Row.component';
import RowItem from './components/RowItem.component';
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
  name,
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
          <FormElementComponent title="Name">
            <StringComponent
              setValue={value => {
                setEvent(
                  eventId,
                  timeline.Event.fromJSON({
                    endsOn,
                    formula,
                    formulaType,
                    name: value,
                    startsOn,
                  }),
                );
              }}
              value={name}
            />
          </FormElementComponent>
        </RowItem>
      </Row>
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
                    name,
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
                    name,
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
              name,
              startsOn,
            }),
          );
        }}
      />
    </div>
  );
}

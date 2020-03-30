import * as React from 'react';

import { CalendarDate } from '../../../calendar-date';
import { Event, EventJSON } from '../../../timeline';
import * as actions from '../../redux/actions';
import CalendarDateComponent from '../../components/CalendarDate.component';
import StringComponent from '../../components/String.component';
import NullableCalendarDateComponent from '../../components/NullableCalendarDate.component';
import FormElementComponent from '../../components/FormElement.component';
import EventAccountIdsContainer from './EventAccountIds.container';
import FormulaComponent from './Formula.component';

type Props = EventJSON & {
  setEvent: typeof actions.forecast.setEvent;
};

export default function EventComponent(props: Props) {
  const { endsOn, id, formula, formulaType, name, setEvent, startsOn } = props;
  return (
    <>
      <EventAccountIdsContainer eventId={id} />
      <FormElementComponent title="Name">
        <StringComponent
          setValue={value => {
            setEvent(Event.fromJSON({ ...props, name: value }));
          }}
          value={name}
        />
      </FormElementComponent>
      <FormElementComponent title="Starts">
        <CalendarDateComponent
          setValue={value => {
            let newEndsOn = endsOn;
            if (newEndsOn) {
              if (CalendarDate.fromJSON(newEndsOn).daysBefore(value) > 0) {
                newEndsOn = value.toJSON();
              }
            }
            setEvent(
              Event.fromJSON({
                ...props,
                endsOn: newEndsOn,
                startsOn: value.toJSON(),
              }),
            );
          }}
          value={startsOn}
        />
      </FormElementComponent>
      <FormElementComponent title="Ends">
        <NullableCalendarDateComponent
          setValue={value => {
            let newStartsOn = startsOn;
            if (value) {
              if (CalendarDate.fromJSON(startsOn).daysAfter(value) > 0) {
                newStartsOn = value.toJSON();
              }
            }
            setEvent(
              Event.fromJSON({
                ...props,
                endsOn: value ? value.toJSON() : null,
                startsOn: newStartsOn,
              }),
            );
          }}
          value={endsOn}
        />
      </FormElementComponent>
      <FormulaComponent
        formula={formula}
        formulaType={formulaType}
        setFormula={value => {
          setEvent(
            Event.fromJSON({
              ...props,
              formula: value.toJSON(),
            }),
          );
        }}
      />
    </>
  );
}

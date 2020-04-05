import * as React from 'react';

import { CalendarDate } from '../../../calendar-date';
import { Event, EventFormulaType, EventJSON } from '../../../timeline';
import * as actions from '../../redux/actions';
import CalendarDateComponent from '../../components/CalendarDate.component';
import SelectComponent from '../../components/Select.component';
import StringComponent from '../../components/String.component';
import NullableCalendarDateComponent from '../../components/NullableCalendarDate.component';
import FormElementComponent from '../../components/FormElement.component';
import { newEvent } from '../../defaults';
import EventAccountIdsContainer from './EventAccountIds.container';
import FormulaComponent from './Formula.component';

type Props = EventJSON & {
  setEvent: typeof actions.forecast.setEvent;
};

export default function EventComponent(props: Props) {
  const { endsOn, id, formula, formulaType, name, setEvent, startsOn } = props;
  return (
    <table>
      <tbody>
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
        <FormElementComponent title="Formula">
          <SelectComponent
            options={[
              { name: 'Lump Sum', value: EventFormulaType.LumpSum },
              { name: 'Monthly Sum', value: EventFormulaType.MonthlySum },
              { name: 'Recurring Sum', value: EventFormulaType.RecurringSum },
            ]}
            setValue={value => {
              if (value === formulaType) {
                return;
              }

              const { formula: newFormula } = newEvent('0', value, true);

              setEvent(
                Event.fromJSON({
                  ...props,
                  formulaType: value,
                  formula: newFormula.toJSON(),
                }),
              );
            }}
            value={formulaType}
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
      </tbody>
    </table>
  );
}

import * as React from 'react';

import { CalendarDate } from '../../calendar-date';
import * as timeline from '../../timeline';
import * as actions from '../redux/actions';
import CalendarDateComponent from '../components/CalendarDate.component';
import StringComponent from '../components/String.component';
import NullableCalendarDateComponent from '../components/NullableCalendarDate.component';
import FormElementComponent from '../components/FormElement.component';
import Row from './components/Row.component';
import RowItem from './components/RowItem.component';
import FormulaComponent from './formula/Formula.component';

type Props = timeline.EventJSON & {
  removeEvent: typeof actions.forecast.removeEvent;
  setEvent: typeof actions.forecast.setEvent;
};

export default function EventComponent(props: Props) {
  const {
    endsOn,
    id,
    formula,
    formulaType,
    name,
    removeEvent,
    setEvent,
    startsOn,
  } = props;
  return (
    <div>
      <div>
        <button onClick={() => removeEvent(id)}>Remove</button> {formulaType}
      </div>
      <Row>
        <RowItem>
          <FormElementComponent title="Name">
            <StringComponent
              setValue={value => {
                setEvent(timeline.Event.fromJSON({ ...props, name: value }));
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
                let newEndsOn = endsOn;
                if (newEndsOn) {
                  if (CalendarDate.fromJSON(newEndsOn).daysBefore(value) > 0) {
                    newEndsOn = value.toJSON();
                  }
                }
                setEvent(
                  timeline.Event.fromJSON({
                    ...props,
                    endsOn: newEndsOn,
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
                let newStartsOn = startsOn;
                if (value) {
                  if (CalendarDate.fromJSON(startsOn).daysAfter(value) > 0) {
                    newStartsOn = value.toJSON();
                  }
                }
                setEvent(
                  timeline.Event.fromJSON({
                    ...props,
                    endsOn: value ? value.toJSON() : null,
                    startsOn: newStartsOn,
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
            timeline.Event.fromJSON({
              ...props,
              formula: value.toJSON(),
            }),
          );
        }}
      />
    </div>
  );
}

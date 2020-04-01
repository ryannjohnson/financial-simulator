import * as React from 'react';

import { CalendarDate } from '../../../calendar-date';
import { Effect, EffectFormulaType, EffectJSON } from '../../../timeline';
import * as actions from '../../redux/actions';
import SelectComponent from '../../components/Select.component';
import StringComponent from '../../components/String.component';
import NullableCalendarDateComponent from '../../components/NullableCalendarDate.component';
import FormElementComponent from '../../components/FormElement.component';
import { newEffect } from '../../defaults';
import FormulaComponent from './Formula.component';

type Props = EffectJSON & {
  accountId: string | null;
  setEffect: typeof actions.forecast.setEffect;
};

export default function EffectComponent(props: Props) {
  const { endsOn, formula, formulaType, name, setEffect, startsOn } = props;
  return (
    <table>
      <tbody>
        <FormElementComponent title="Name">
          <StringComponent
            setValue={value => {
              setEffect(Effect.fromJSON({ ...props, name: value }));
            }}
            value={name}
          />
        </FormElementComponent>
        <FormElementComponent title="Starts">
          <NullableCalendarDateComponent
            setValue={value => {
              let newEndsOn = endsOn;
              if (newEndsOn && value) {
                if (CalendarDate.fromJSON(newEndsOn).daysBefore(value) > 0) {
                  newEndsOn = value.toJSON();
                }
              }
              setEffect(
                Effect.fromJSON({
                  ...props,
                  endsOn: newEndsOn,
                  startsOn: value ? value.toJSON() : null,
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
              if (newStartsOn && value) {
                if (CalendarDate.fromJSON(newStartsOn).daysAfter(value) > 0) {
                  newStartsOn = value.toJSON();
                }
              }
              setEffect(
                Effect.fromJSON({
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
              { name: 'Compounding', value: EffectFormulaType.Compounding },
            ]}
            setValue={value => {
              if (value === formulaType) {
                return;
              }

              const { formula } = newEffect(value);

              setEffect(
                Effect.fromJSON({
                  ...props,
                  formulaType: value,
                  formula: formula.toJSON(),
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
            setEffect(
              Effect.fromJSON({
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

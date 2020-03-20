import { FormulaType } from '../../../timeline';

export const ADD_EVENT = 'FORECAST_ADD_EVENT';

export interface AddEvent {
  formulaType: FormulaType;
  type: typeof ADD_EVENT;
}

export type Action = AddEvent;

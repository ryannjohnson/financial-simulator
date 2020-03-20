import { FormulaType } from '../../../timeline';
import * as types from '../types';

export function addEvent(formulaType: FormulaType): types.forecast.AddEvent {
  return { formulaType, type: types.forecast.ADD_EVENT };
}

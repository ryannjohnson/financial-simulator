import { Amount, Currency } from '../../../amount';
import { CalendarDate } from '../../../calendar-date';
import {
  Event,
  EventFormula,
  EventFormulaType,
  LumpSumFormula,
  MonthlySumFormula,
  RecurringSumFormula,
} from '../../../timeline';
import { generateLocalUUID } from '../../../utils';

export function newEvent(
  accountId: string,
  formulaType: EventFormulaType,
  isIncome: boolean,
) {
  const amount = Amount.zero(Currency.USD);
  const startsOn = CalendarDate.today();
  const endsOn = startsOn.addMonths(1);
  let formula: EventFormula;

  if (formulaType === EventFormulaType.LumpSum) {
    formula = new LumpSumFormula(amount);
  } else if (formulaType === EventFormulaType.MonthlySum) {
    formula = new MonthlySumFormula(amount);
  } else if (formulaType === EventFormulaType.RecurringSum) {
    formula = new RecurringSumFormula(amount, 7);
  } else {
    throw new Error(`FormulaType "${formulaType}" has not been implemented`);
  }

  const id = generateLocalUUID();
  let fromAccountId: string | null = null;
  let toAccountId: string | null = accountId;
  if (!isIncome) {
    fromAccountId = accountId;
    toAccountId = null;
  }
  const name = '';

  return new Event(
    id,
    fromAccountId,
    toAccountId,
    formula,
    startsOn,
    endsOn,
    name,
  );
}

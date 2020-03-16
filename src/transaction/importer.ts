import moment from 'moment';

import { Amount, Currency } from '../amount';
import { CalendarDate } from '../calendar-date';
import { isObject } from '../utils';
import { Transaction } from './transaction';

type Config = {
  amountFieldName: string | number;
  amountPolarity: AmountPolarity | null;
  currency: Currency;
  dateFieldName: string | number;
  descriptionFieldName: string | number;
};

type AmountPolarity = {
  debitValue: string;
  fieldName: string | number;
};

export class Importer {
  constructor(private config: Config) {}

  public toTransaction(data: any): Transaction {
    if (!isObject(data)) {
      throw new Error(`Importer data must be an object`);
    }

    const amountRaw = data[this.config.amountFieldName];
    if (!amountRaw) {
      throw new Error(
        `Importer data amount "${amountRaw}" must be a number or a string`,
      );
    }

    let shouldInvertSign = false;
    const { amountPolarity } = this.config;
    if (amountPolarity) {
      shouldInvertSign =
        data[amountPolarity.fieldName] === amountPolarity.debitValue;
    }

    const dateRaw = data[this.config.dateFieldName];
    const dateMoment = moment(dateRaw);
    if (!dateMoment.isValid()) {
      throw new Error(`Importer data date "${dateRaw}" is invalid`);
    }

    const description = data[this.config.descriptionFieldName];
    if (typeof description !== 'string') {
      throw new Error(`Importer data description must be a string`);
    }

    const amount = toAmount(this.config.currency, amountRaw, shouldInvertSign);
    const date = CalendarDate.fromMoment(dateMoment);

    return new Transaction(date, amount, description);
  }
}

function toAmount(
  currency: Currency,
  amountRaw: string | number,
  shouldInvertSign: boolean,
): Amount {
  const multiplier = shouldInvertSign ? -1 : 1;

  if (currency === Currency.USD) {
    if (typeof amountRaw === 'string') {
      amountRaw = parseFloat(amountRaw);
    }
    return new Amount(currency, Math.round(amountRaw * 100 * multiplier));
  }

  throw new Error(`Importer currency "${currency}" cannot be parsed`);
}

import { isNumber, isObject } from './utils';

export enum Currency {
  USD = 'USD', // Cents
}

export type AmountJSON = {
  currency: string;
  value: number;
};

/**
 * Relative to a person's net worth, so positive added money to an
 * account, and negative removed it from a person's net worth.
 */
export class Amount {
  public static fromJSON(value: any): Amount {
    if (!isObject(value)) {
      throw new Error('Amount JSON value must be an object');
    }

    if (!isNumber(value.value)) {
      throw new Error('Amount JSON value.value must be a number');
    }

    return new Amount(toCurrency(value.currency), value.value);
  }

  constructor(public currency: Currency, public value: number) {
    if (!Number.isInteger(value)) {
      throw new Error(`Amount value "${value}" must be an integer`);
    }
  }

  public add(amount: Amount): Amount {
    if (this.currency !== amount.currency) {
      throw new Error(
        `Account does not support multiple currencies, found "${this.currency}" and "${amount.currency}"`
      );
    }

    return new Amount(this.currency, this.value + amount.value);
  }

  public toJSON(): AmountJSON {
    return {
      currency: this.currency,
      value: this.value,
    };
  }

  public toString(): string {
    switch (this.currency) {
      case Currency.USD:
        const dollars = this.value * 100;
        return `$${dollars.toFixed(2)}`;
      default:
        throw new Error(`Amount currency "${this.currency}" has no serializer`);
    }
  }
}

const currencyValues = new Set(Object.values(Currency));

export function toCurrency(value: any): Currency {
  if (!currencyValues.has(value)) {
    throw new Error(`Currency value "${value}" is invalid`);
  }

  return value;
}

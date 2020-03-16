import parse from 'csv-parse';

import { Currency } from '../../amount';
import { Transaction } from '../transaction';

type Record = {
  ['Card No.']: string;
  Category: string;
  Credit: string; // 48.02
  Debit: string; // 48.02
  Description: string;
  ['Posted Date']: '2020-03-12'; // YYYY-MM-DD
  ['Transaction Date']: '2020-03-11'; // YYYY-MM-DD
};

const parseOptions = { columns: true, skip_empty_lines: true };

/**
 * TODO: Convert to a streamable interface.
 */
export function parseCSVString(fullDocument: string): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    parse(
      fullDocument,
      parseOptions,
      (error: Error | undefined, records: Record[]) => {
        if (error) {
          return reject(error);
        }

        resolve(records.map(toTransaction));
      }
    );
  });
}

function toTransaction(record: Record): Transaction {
  return Transaction.fromJSON({
    amount: {
      currency: Currency.USD,
      value: toAmountValue(record),
    },
    date: record['Posted Date'],
    description: record.Description,
  });
}

function toAmountValue(record: Record): number {
  const debitMatch = record.Debit.match(amountPattern);
  if (debitMatch) {
    return parseInt(record.Debit.replace('.', ''), 10);
  }

  const creditMatch = record.Credit.match(amountPattern);
  if (creditMatch) {
    return parseInt(record.Credit.replace('.', ''), 10);
  }

  throw new Error("Record doesn't have a Credit or Debit field");
}

const amountPattern = /^\d+\.\d{2}$/;

import parse from 'csv-parse';

import { Currency } from '../../amount';
import { Transaction } from '../transaction';

type Record = {
  Amount: string; // -123.45
  Balance: string; // 1234.56
  'Check or Slip #': string;
  Description: string;
  Details: string;
  'Posting Date': string; // MM/DD/YYYY
  Type: string;
};

const parseOptions = {
  columns: true,
  relax_column_count_more: true,
  skip_empty_lines: true,
};

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
  const amountMatch = record.Amount.match(amountPattern);
  if (!amountMatch) {
    throw new Error(`Chase amount "${record.Amount}" is invalid`);
  }

  const amountValue = parseInt(record.Amount.replace('.', ''), 10);

  const dateMatch = record['Posting Date'].match(datePattern);
  if (!dateMatch) {
    throw new Error(
      `Chase Posting Date "${record['Posting Date']}" is invalid`
    );
  }

  return Transaction.fromJSON({
    amount: {
      currency: Currency.USD,
      value: amountValue,
    },
    date: `${dateMatch[3]}-${dateMatch[1]}-${dateMatch[2]}`,
    description: record.Description,
  });
}

const amountPattern = /^-?\d+\.\d{2}$/;

const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

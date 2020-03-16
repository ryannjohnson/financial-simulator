import { Currency } from '../../amount';
import { generateLocalUUID } from '../../utils';
import { Transaction } from '../transaction';
import { parseCSVString as parse } from './common';

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

export function parseCSVString(fullDocument: string): Promise<Transaction[]> {
  return parse(parseOptions, fullDocument, toTransaction);
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
      `Chase Posting Date "${record['Posting Date']}" is invalid`,
    );
  }

  return Transaction.fromJSON({
    amount: {
      currency: Currency.USD,
      value: amountValue,
    },
    date: `${dateMatch[3]}-${dateMatch[1]}-${dateMatch[2]}`,
    description: record.Description,
    id: generateLocalUUID(),
  });
}

const amountPattern = /^-?\d+\.\d{2}$/;

const datePattern = /^(\d{2})\/(\d{2})\/(\d{4})$/;

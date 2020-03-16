import parse from 'csv-parse';

import { Transaction } from '../transaction';

/**
 * TODO: Convert to a streamable interface.
 */
export function parseCSVString<T>(
  parseOptions: parse.Options,
  fullDocument: string,
  toTransaction: (record: T) => Transaction,
): Promise<Transaction[]> {
  return new Promise((resolve, reject) => {
    parse(
      fullDocument,
      parseOptions,
      (error: Error | undefined, records: T[]) => {
        if (error) {
          return reject(error);
        }

        try {
          resolve(records.map(toTransaction));
        } catch (error) {
          reject(error);
        }
      },
    );
  });
}

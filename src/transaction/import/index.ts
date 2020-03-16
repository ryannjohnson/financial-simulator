import { Transaction } from '../transaction';
import { parseCSVString as parseCapitalOne } from './capital-one';
import { parseCSVString as parseChase } from './chase';

/**
 * Tries every kind of importer until one works.
 */
export async function importString(
  fileContents: string,
): Promise<Transaction[]> {
  for (const parser of [parseCapitalOne, parseChase]) {
    try {
      return await parser(fileContents);
    } catch (error) {
      // console.warn(error);
    }
  }

  throw new Error('Could not parse document');
}

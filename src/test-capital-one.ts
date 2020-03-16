import * as fs from 'fs';

import { parseCSV } from './transaction/import/capital-one';

async function main() {
  const fileContents = fs.readFileSync(
    '/home/gengar/Downloads/2020-03-15_transaction_download.csv',
  );

  await parseCSV(fileContents);
}

if (require.main === module) {
  main()
    .then(() => process.exit())
    .catch(error => {
      console.error(error);
      process.exit(1);
    });
}

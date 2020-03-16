import 'react-app-polyfill/ie11';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { parseCSVString } from '../src/transaction/import/chase';

const App = () => {
  const onChange = event => {
    const input = event.target;

    const reader = new FileReader();

    reader.onload = async () => {
      console.log(await parseCSVString(reader.result as string));
    };

    reader.readAsText(input.files[0]);
  };

  return (
    <div>
      <input type="file" name="csv" onChange={onChange} />
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById('root'));

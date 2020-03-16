import { Data } from 'plotly.js';
import * as React from 'react';
import Plot from 'react-plotly.js';

import { Account, AccountJSON } from '../../account';
import { getMonthlyTrailingBalance } from '../../chart/historical';

export type Props = {
  accounts: AccountJSON[];
};

export default class HistoricalChartComponent extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    if (this.props.accounts.length !== nextProps.accounts.length) {
      return true;
    }

    for (let i = 0; i < this.props.accounts.length; i++) {
      const oldAccount = this.props.accounts[i];
      const newAccount = nextProps.accounts[i];

      if (oldAccount.id !== newAccount.id) {
        return true;
      }

      if (oldAccount.balance.value !== newAccount.balance.value) {
        return true;
      }

      if (oldAccount.transactions.length !== newAccount.transactions.length) {
        return true;
      }
    }

    return false;
  }

  render() {
    const trailingBalancesArray = this.props.accounts.map(account => {
      return getMonthlyTrailingBalance(Account.fromJSON(account));
    });

    const data: Data[] = [];

    for (const trailingBalances of trailingBalancesArray) {
      const x: Date[] = [];
      const y: number[] = [];

      for (const { balance, date } of trailingBalances) {
        x.push(date.toDate());
        y.push(balance.value / 100);
      }

      data.push({
        x,
        y,
        type: 'scattergl',
        mode: 'lines+markers',
        marker: { color: 'red' },
      });
    }

    return (
      <Plot
        data={data}
        layout={{ width: 640, height: 480, title: 'A Fancy Plot' }}
      />
    );
  }
}

// export default function HistoricalChartComponent({ accounts }: Props) {
//   const trailingBalances = getTrailingBalances(
//     Currency.USD,
//     accounts.map(a => Account.fromJSON(a)),
//   );

//   const x: Date[] = [];
//   const y: number[] = [];

//   for (const { balance, date } of trailingBalances) {
//     x.push(date.toDate());
//     y.push(balance.value / 100);
//   }

//   const trailingBalanceData: Data = {
//     x,
//     y,
//     type: 'scatter',
//     mode: 'lines+markers',
//     marker: { color: 'red' },
//   };

//   return (
//     <Plot
//       data={[trailingBalanceData]}
//       layout={{ width: 640, height: 480, title: 'A Fancy Plot' }}
//     />
//   );
// }

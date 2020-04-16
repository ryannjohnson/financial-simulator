# Financial simulator

Use it at <https://ryannjohnson.github.io/financial-simulator>.

_DISCLAIMER: This project was lightly-researched! Do not try to glean any
financial adviice from it, because I'm not qualified to give any!_

On that note, feel free to open issues/PRs to fix some of my assumptions about
how financial tools work.

## How it works

Here's a demo video of its core features: <https://youtu.be/7IEB6aaAf3E>.

Once you're comfortable with the component parts, play around with them and
watch your account balances rise and fall over time.

### Accounts

**Accounts are places you keep your money in real life.** You might have a cash
account, a savings account, a 401k, money invested in bonds, stocks, mutual
funds, etc. Each of these places should be their own "account" in the simulator.

### Effects

**Effects are the ways that accounts affect your money over time.** Add effects
to simulate inflation and returns on investments.

### Events

**Events move money into, out of, and between your accounts.** Use them to
represent your recurring income and expenses, investments in financial products
(represented by your other accounts), one-time transfers, or whatever you move
money for.

Events are also how you should manually represent complex transactions like
taxes.

## Development

Install the main project dependencies:

```bash
$ npm install
```

Install the example dependencies and run the development server locally:

```bash
$ cd example
$ npm install
$ npm run start
```

# Financial simulator

This is a single-page web app for rapidly prototyping financial scenarios. Works
best on desktop browsers.

Use it at <https://ryannjohnson.github.io/financial-simulator>.

## Motivation

This project helped me achieve "play" with my finances. Before I made this, I
was accustomed to creating Excel spreadsheets to simulate my personal financial
scenarios. Working with timelines and graphs feels more intuitive to me, and
doing so helps me focus on the scenarios I want to run.

_DISCLAIMER: This project was lightly-researched! Do not try to glean any
financial advice from it, because I'm not qualified to give any!_

## How it works

This video demonstrates the web app's core features:
<https://youtu.be/7IEB6aaAf3E>.

- **Accounts are places you keep your money in real life.** You might have a
  cash account, a savings account, a 401k, money invested in bonds, stocks,
  mutual funds, etc. Each of these places should be their own "account" in the
  simulator.
- **Effects are the ways that accounts affect your money over time.** Add
  effects to simulate inflation and returns on investments.
- **Events move money into, out of, and between your accounts.** Use them to
  represent your recurring income and expenses, investments in financial
  products (represented by your other accounts), one-time transfers, or whatever
  you move money for. Events are also how you should manually represent complex
  transactions like taxes.

The application stays in your browser and requires no server-side component to
run.

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

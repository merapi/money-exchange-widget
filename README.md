![alt text](https://s3.gifyu.com/images/exchangeFlow.gif)

### Install & run the project:

1. `yarn` or `npm i`
2. `yarn server` or `npm run server`
3. `yarn start` or `npm start`

---

### About API
API is just a simple exchangeratesapi.io proxy, it runs on port 9000 and will print console logs to track what is happening.<br />
There is a 2s delay in each API response (to test the real-world usage on a slow connection)

### About React app
Most lightweight (just Hooks) solution to the problem.<br />
We don't do the exchange operation on the client, the client should only provide an interface to enter the currencies and amount.<br />
App will re-fetch FX rates every 10s for current base currency (main/top Pocket).<br />
On every currency change in the main Pocket, app will cancel old requests, reset the timer and fetch new FX rates for the new base currency.

---

Todo:
- Complex state management? (Do we need redux in this project? probably not)
- Better money handling (Dinero etc.) - on the server
- Tests (react-testing-library + E2E Cypress)
- Better amount length control (wider input?)
- Live data (WebSockets?) to update accounts balances and fx rates
- Swipe left/right to change the currency (on touch devices)
- Display exchange rate of 1 unit

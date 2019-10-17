![alt text](https://s3.gifyu.com/images/exchangeFlow.gif)

### Install & run the project:

1. `yarn` or `npm i`
2. `yarn server` or `npm run server`
3. `yarn start` or `npm start`

---

### About API
API is just a simple exchangeratesapi.io proxy, it runs on port 9000 and will print console logs to track what is happening.<br />
There is a 2s delay in each API response (to test the real world usage on slow connection)

### About React app
App will refetch FX rates every 10s for current base currency (main/top Pocket).<br />
On every currency change in the main Pocket it will cancel old requests, reset the timer and fetch new FX rates for the new base currency.

---

Todo:
- Better money handling (Dinero etc.)
- Tests (react-testing-library + E2E Cypress)
- Better amount length control (wider input?)

const express = require('express')
const cors = require('cors')
const got = require('got')
const app = express()
const port = 9000

const SUPPORTED_CURRENCIES = ['USD', 'GBP', 'EUR', 'PLN']
const RESPONSE_DELAY = 1000 * 2

app.use(cors())

app.use((req, res, next) => {
  setTimeout(() => next(), RESPONSE_DELAY)
})

let accounts = {
  raw: {
    USD: 1000,
    GBP: 2000,
    EUR: 3000,
    PLN: 4000,
  },
}

let fxJson = {
  base: 'USD',
  rates: {
    USD: 1,
  },
}

app.get('/accounts', async (req, res) => {
  res.json(accounts)
})

app.get('/exchange', async (req, res) => {
  const qs = req.query //from: EUR, to: PLN, amount: 100, rate: 4.30, result: 430 - just for verification (what user sees === what user gets)

  // Get current fx rate for a given pair and check if it's ~equal (small margin can be accepted?)
  // I will user the rate that user saw on the exchange screen
  const rate = parseFloat(qs.rate)
  const fromAmount = parseFloat(qs.amount)
  const toAmount = fromAmount * rate

  console.log(`💱 New exchange ${qs.amount} ${qs.from} to ${toAmount} ${qs.to}, rate ${rate}`)

  if (accounts.raw[qs.from] - fromAmount < 0) {
    const error = '🚫 Not enough money'
    console.error(error)
    console.log()
    return res.json({ error })
  }

  accounts.raw[qs.from] -= fromAmount
  accounts.raw[qs.to] += toAmount

  console.log('✅ Exchange success, updated accounts 💰:', accounts)
  console.log()
  res.json(accounts)
})

app.get('/', async (req, res) => {
  const qs = req.query
  const path = req.originalUrl.substring(1)
  const fxJson = await got(
    `https://api.exchangeratesapi.io/latest${path}&symbols=${SUPPORTED_CURRENCIES.join(',')}`,
  ).then(response => JSON.parse(response.body))
  for (currency in fxJson.rates) {
    if (currency !== qs.base) {
      fxJson.rates[currency] = fxJson.rates[currency] * (Math.random() * (1.01 - 0.99) + 0.99) // change rate by max 1%
    }
  }
  console.log('💹 New FX rates', fxJson)
  console.log()
  res.json(fxJson)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log('💰 Fresh accounts:', accounts)
  console.log()
})

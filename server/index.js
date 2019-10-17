const express = require('express')
const got = require('got')
const app = express()
const port = 9000

let accounts = {
  USD: 1000,
  GBP: 1000,
  EUR: 1000,
  PLN: 1000,
}

let fxJson = {
  base: 'USD',
  rates: {
    'USD': 1
  }
}

app.get('/accounts', async (req, res) => {
  res.json(accounts)
})

app.get('/exchange', async (req, res) => {
  const qs = req.query //from: EUR, to: PLN, amount: 100, rate: 4.30 - just for verification (what user sees === what user gets)

  // Get current fx rate fro a given pair and check if it's ~equal (small margin can be accepted?)
  // I will user the rate that user saw on the exchange screen
  const rate = parseFloat(qs.rate)
  const fromAmount = parseFloat(qs.amount)
  const toAmount = fromAmount * rate

  console.log(`💱 New exchange ${qs.amount} ${qs.from} to ${toAmount} ${qs.to}, rate ${rate}`)

  if (accounts[qs.from] - fromAmount < 0) {
    const error = `🚫 Not enough money`
    console.error(error)
    console.log()
    return res.json({ error })
  }

  accounts[qs.from] -= fromAmount
  accounts[qs.to] += toAmount

  console.log(`✅ Exchange success, updated accounts 💰:`, accounts)
  console.log()
  res.json(accounts)
})

app.get('/', async (req, res) => {
  const qs = req.query
  const path = req.originalUrl.substring(1)
  const fxJson = await got(`https://api.exchangeratesapi.io/latest${path}`).then(response => JSON.parse(response.body))
  for (currency in fxJson.rates) {
    if (currency !== qs.base) {
      fxJson.rates[currency] = fxJson.rates[currency] * (Math.random() * (1.05 - 0.95) + 0.95) // change rate by max 5%
    }
  }
  console.log(`💹 New FX rates`, fxJson)
  console.log()
  res.json(fxJson)
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
  console.log(`💰 Fresh accounts:`, accounts)
  console.log()
})

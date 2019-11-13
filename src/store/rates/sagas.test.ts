import { call, put, cancelled } from 'redux-saga/effects'
import * as sagas from './sagas'
import * as actions from './actions'
import Api, { FetchRatesResponse } from 'api'
import { Currency } from 'store/types'

describe('Rates saga', () => {
  test('Fetch rates', () => {
    const baseCurrency: Currency = 'USD'
    const generator = sagas.fetchRates(actions.fetchRates(baseCurrency))
    const abortController = new window.AbortController()
    const response: FetchRatesResponse = {
      base: 'USD',
      date: '2019-10-31',
      rates: {
        USD: 1,
        PLN: 3.9,
      },
    }

    const yieldCall = generator.next()
    expect(yieldCall.value).toEqual(call(Api.finance.fetchRates, baseCurrency, abortController))

    const yieldPut = generator.next(response)
    expect(yieldPut.value).toEqual(put(actions.fetchRatesSuccess(response.base, response.rates)))

    const yieldCancelled = generator.next()
    console.log(yieldCancelled)
    expect(yieldCancelled.value).toEqual(cancelled())

    expect(generator.next().done).toBe(true)
  })
})

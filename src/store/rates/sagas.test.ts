import { call, put, cancelled } from 'redux-saga/effects'
import { cloneableGenerator } from '@redux-saga/testing-utils'
import * as sagas from './sagas'
import * as actions from './actions'
import Api, { FetchRatesResponse } from 'api'
import { Currency } from 'store/types'
import { Saga } from '@redux-saga/types'

describe('Rates saga', () => {
  test('Fetch rates', () => {
    const baseCurrency: Currency = 'USD'
    const generator = cloneableGenerator(sagas.fetchRates as Saga)(actions.fetchRates(baseCurrency))
    const abortController = new window.AbortController()
    const response: FetchRatesResponse = {
      base: 'USD',
      date: '2019-10-31',
      rates: {
        USD: 1,
        PLN: 3.9,
      },
    }

    let currentYield = generator.next().value
    const yieldCallApi = call(Api.finance.fetchRates, baseCurrency, abortController)
    expect(currentYield).toEqual(yieldCallApi)

    const generatorCloneCancelPath = generator.clone()
    const generatorCloneErrorPath = generator.clone()

    currentYield = generator.next(response).value
    const yieldPutSuccess = put(actions.setRates(response.base, response.rates))
    expect(currentYield).toEqual(yieldPutSuccess)

    currentYield = generator.next().value
    const yieldIfCancelled = cancelled()
    expect(currentYield).toEqual(yieldIfCancelled)

    expect(generator.next().done).toBe(true)

    // Test request cancelling
    if (generatorCloneCancelPath.return) {
      currentYield = generatorCloneCancelPath.return().value
      expect(currentYield).toEqual(yieldIfCancelled)
      // true/yes, it was cancelled
      generatorCloneCancelPath.next(true)

      expect(generatorCloneCancelPath.next().done).toBe(true)
    }

    // Test fetch error
    if (generatorCloneErrorPath.throw) {
      const error = new Error(`Fetch error`)
      currentYield = generatorCloneErrorPath.throw(error).value
      const yieldPutError = put(actions.fetchRatesError(error))
      expect(currentYield).toEqual(yieldPutError)
    }
  })
})

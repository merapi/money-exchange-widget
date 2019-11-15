import { call, put, takeLatest, delay, select, cancelled, race, take, fork, cancel } from 'redux-saga/effects'
import Api, { FetchRatesResponse } from 'api'
import { FetchRates, RatesActionsConsts } from './types'
import * as actions from './actions'
import * as selectors from './selectors'
import * as pocketSelectors from 'store/pockets/selectors'
import { PocketType, PocketsActionsConsts } from 'store/pockets/types'
import { Currency } from 'store/types'

export function* fetchRates(baseCurrency: Currency) {
  const abortController = new window.AbortController()
  try {
    const winner = yield race({
      response: call(Api.finance.fetchRates, baseCurrency, abortController),
      timeout: delay(3000),
    })

    if (winner.response) {
      yield put(actions.setRates(winner.response.base, winner.response.rates))
    } else {
      abortController.abort()
    }
    // const response: FetchRatesResponse = yield call(Api.finance.fetchRates, baseCurrency, abortController)
    // yield put(actions.setRates(response.base, response.rates))
  } catch (e) {
    yield put(actions.fetchRatesError(e))
    console.error(`fetchRates`, e)
  } finally {
    if (yield cancelled()) {
      abortController.abort()
    }
  }
}

export function* syncFetchRates() {
  try {
    let baseCurrency = yield select(pocketSelectors.pocketCurrency(PocketType.FROM))
    while (true) {
      // const baseCurrency = yield select(pocketSelectors.pocketCurrency(PocketType.FROM))
      const taskFetchRates = yield fork(fetchRates, baseCurrency)
      const winner = yield race({
        timer: delay(1000 * 60),
        baseCurrencyChanged: take(PocketsActionsConsts.BASE_CURRENCY_CHANGED),
      })
      baseCurrency = yield select(pocketSelectors.pocketCurrency(PocketType.FROM))
      if (winner.baseCurrencyChanged) {
        yield put(actions.setRates(winner.baseCurrencyChanged.currency, {}))
        yield cancel(taskFetchRates)
        baseCurrency = winner.baseCurrencyChanged.currency
      }
    }
  } finally {
    if (yield cancelled()) {
      console.log(`syncFetchRates cancelled`)
    }
  }
}

export function* loopFetchRates() {
  while (yield take(RatesActionsConsts.START_FETCH_RATES)) {
    const task = yield fork(syncFetchRates)
    yield take(RatesActionsConsts.STOP_FETCH_RATES)
    yield cancel(task)
  }
}

export default function*() {
  yield fork(loopFetchRates)
}

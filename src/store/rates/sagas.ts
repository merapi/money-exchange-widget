import { call, put, takeLatest, delay, select, cancelled, race, take, fork, cancel } from 'redux-saga/effects'
import Api, { FetchRatesResponse } from 'api'
import { FetchRates, RatesActionsConsts } from './types'
import * as actions from './actions'
import * as selectors from './selectors'
import * as pocketSelectors from 'store/pockets/selectors'
import { PocketType, PocketsActionsConsts } from 'store/pockets/types'
import { Currency } from 'store/types'

export function* fetchRates(baseCurrency: Currency) {
  console.log(`fetchRates`)
  const abortController = new window.AbortController()
  try {
    const winner = yield race({
      response: call(Api.finance.fetchRates, baseCurrency, abortController),
      timeout: delay(3000),
    })

    console.log(`fetchRates winner`, winner)
    if (winner.response) {
      yield put(actions.setRates(winner.response.base, winner.response.rates))
    } else {
      console.log(`timeout abort`)
      abortController.abort()
    }
    // const response: FetchRatesResponse = yield call(Api.finance.fetchRates, baseCurrency, abortController)
    // yield put(actions.setRates(response.base, response.rates))
  } catch (e) {
    yield put(actions.fetchRatesError(e))
    console.error(`fetchRates`, e)
  } finally {
    console.log(`fetchRates finally`)
    if (yield cancelled()) {
      abortController.abort()
      console.log(`fetchRates cancelled`)
    }
  }
}

export function* syncFetchRates() {
  console.log(`syncFetchRates`)
  try {
    let baseCurrency = yield select(pocketSelectors.pocketCurrency(PocketType.FROM))
    while (true) {
      console.group(`syncFetchRates while`)
      // const baseCurrency = yield select(pocketSelectors.pocketCurrency(PocketType.FROM))
      console.log(`baseCurrency`, baseCurrency)
      const taskFetchRates = yield fork(fetchRates, baseCurrency)
      const winner = yield race({
        timer: delay(1000 * 60),
        baseCurrencyChanged: take(PocketsActionsConsts.BASE_CURRENCY_CHANGED),
      })
      baseCurrency = yield select(pocketSelectors.pocketCurrency(PocketType.FROM))
      if (winner.baseCurrencyChanged) {
        console.warn(`winner.baseCurrencyChanged, cancel taskFetchRates`)
        yield put(actions.setRates(winner.baseCurrencyChanged.currency, {}))
        yield cancel(taskFetchRates)
        baseCurrency = winner.baseCurrencyChanged.currency
      }
      console.groupEnd()
    }
  } finally {
    console.log(`syncFetchRates finally`)
    if (yield cancelled()) {
      console.log(`syncFetchRates cancelled`)
    }
  }
}

export function* loopFetchRates() {
  console.log(`loopFetchRates`)
  while (yield take(RatesActionsConsts.START_FETCH_RATES)) {
    console.group(`loopFetchRates while`)
    const task = yield fork(syncFetchRates)
    yield take(RatesActionsConsts.STOP_FETCH_RATES)
    console.log(`loopFetchRates cancel`)
    yield cancel(task)
    console.groupEnd()
  }
}

export default function*() {
  yield fork(loopFetchRates)
}

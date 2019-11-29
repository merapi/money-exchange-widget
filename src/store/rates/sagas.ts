import Api from 'api'
import { FX_FETCH_INTERVAL, FX_FETCH_TIMEOUT } from 'config/consts'
import { call, cancel, cancelled, delay, fork, put, race, select, take } from 'redux-saga/effects'
import * as pocketSelectors from 'store/pockets/selectors'
import { PocketsActionsConsts, PocketType } from 'store/pockets/types'
import { Currency } from 'store/types'
import * as actions from './actions'
import { RatesActionsConsts } from './types'

export function* fetchRates(baseCurrency: Currency) {
  const abortController = new window.AbortController()
  try {
    const winner = yield race({
      response: call(Api.finance.fetchRates, baseCurrency, abortController),
      timeout: delay(FX_FETCH_TIMEOUT),
    })

    if (winner.response) {
      yield put(actions.setRates(winner.response.base, winner.response.rates))
    } else {
      abortController.abort()
    }
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
      const taskFetchRates = yield fork(fetchRates, baseCurrency)
      const winner = yield race({
        timer: delay(FX_FETCH_INTERVAL),
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

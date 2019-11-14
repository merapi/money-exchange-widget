import { call, put, takeLatest, delay, select, cancelled } from 'redux-saga/effects'
import Api, { FetchRatesResponse } from 'api'
import { FetchRates, RatesActionsConsts } from './types'
import * as actions from './actions'
import * as selectors from './selectors'

export function* loopFetchRates() {
  while (true) {
    const baseCurrency = yield select(selectors.baseCurrency)
    yield put(actions.fetchRates(baseCurrency))
    yield delay(1000 * 10)
  }
}

export function* fetchRates(action: FetchRates) {
  const { baseCurrency } = action as FetchRates
  const abortController = new window.AbortController()
  try {
    const response: FetchRatesResponse = yield call(Api.finance.fetchRates, baseCurrency, abortController)
    yield put(actions.fetchRatesSuccess(response.base, response.rates))
  } catch (e) {
    yield put(actions.fetchRatesError(e))
    console.error(`fetchRates`, e)
  } finally {
    if (yield cancelled()) {
      abortController.abort()
    }
  }
}

export default function*() {
  yield takeLatest(RatesActionsConsts.LOOP_FETCH_RATES, loopFetchRates)
  yield takeLatest(RatesActionsConsts.FETCH_RATES, fetchRates)
}

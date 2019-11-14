import { call, put, takeLatest, select } from 'redux-saga/effects'
import { PocketsActionsConsts, PocketChange, PocketType } from './types'
import * as actions from './actions'
import * as selectors from './selectors'
import * as ratesSelectors from 'store/rates/selectors'

export function* pocketChange(action: PocketChange) {
  const { pocket, amount, currency } = action

  try {
    const currentlyFocusedPocket = yield select(selectors.focusedPocket)

    if (currentlyFocusedPocket !== pocket) {
      yield put(actions.focusPocket(pocket))
    }

    if (amount !== undefined) {
      const fromCurrency = yield select(selectors.pocketCurrency(PocketType.FROM))
      const toCurrency = yield select(selectors.pocketCurrency(PocketType.TO))
      const exchangeRate = yield select(ratesSelectors.exchangeRate(fromCurrency, toCurrency))

      if (pocket === PocketType.FROM) {
        const toNumber = parseFloat(amount) * exchangeRate
        const toAmount = Number.isNaN(toNumber) ? '' : toNumber.toFixed(2)

        yield put(actions.setPocket(PocketType.FROM, amount, currency))
        yield put(actions.setPocket(PocketType.TO, toAmount))
      }
    }
  } catch (e) {
    console.error(`pocketChange`, e)
  }
}

export default function*() {
  yield takeLatest(PocketsActionsConsts.POCKET_CHANGE, pocketChange)
}

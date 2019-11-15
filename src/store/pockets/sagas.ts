import { call, put, takeLatest, delay } from 'redux-saga/effects'
import { select } from 'utils/typed-saga'
import { PocketsActionsConsts, PocketChange, PocketType, PocketsActions, BaseCurrencyChanged } from './types'
import * as pocketActions from './actions'
import * as accountsActions from 'store/accounts/actions'
import * as pocketSelectors from './selectors'
import * as ratesSelectors from 'store/rates/selectors'
import * as accountSelectors from 'store/accounts/selectors'
import { RatesActionsConsts, RatesActions } from 'store/rates/types'
import { EXCHANGE_FAKE_DELAY } from 'config/consts'

export function* pocketChange(action: PocketChange) {
  try {
    const { pocket, amount, currency } = action
    const currentBaseCurrency = yield select(pocketSelectors.pocketCurrency(PocketType.FROM))

    if (currency && pocket === PocketType.FROM && currentBaseCurrency !== currency) {
      yield put(pocketActions.baseCurrencyChanged(currency))
    }

    // if (currentlyFocusedPocket !== pocket) {
    //   yield put(actions.focusPocket(pocket))
    // }

    if (amount !== undefined || currency !== undefined) {
      const currentlyFocusedPocket = yield select(pocketSelectors.focusedPocket)
      if (currency && !amount && pocket === currentlyFocusedPocket) {
        yield put(pocketActions.focusPocket(pocket))
      }

      yield put(pocketActions.setPocket(pocket, amount, currency))
      // yield put(actions.calculatePockets())
    }
  } catch (e) {
    console.error(`pocketChange`, e)
  }
}

export function* calculateExchange(action: PocketsActions | RatesActions) {
  console.log(`calculateExchange triggered by:`, action) // just to explain logic below

  try {
    const currentlyFocusedPocket = yield* select(pocketSelectors.focusedPocket)

    if (action.type === PocketsActionsConsts.SET_POCKET) {
      if (action.pocket !== currentlyFocusedPocket && action.amount !== undefined && action.currency === undefined) {
        console.log(`^ don't calculate`)
        return
      }
    }

    const pocketFromAmount = yield* select(pocketSelectors.pocketAmount(PocketType.FROM))
    const pocketToAmount = yield* select(pocketSelectors.pocketAmount(PocketType.TO))

    if (!pocketFromAmount && !pocketToAmount) {
      return
    }

    const pocketFromAmountFloat = parseFloat(pocketFromAmount)
    const pocketToAmountFloat = parseFloat(pocketToAmount)

    const fromCurrency = yield* select(pocketSelectors.pocketCurrency(PocketType.FROM))
    const toCurrency = yield* select(pocketSelectors.pocketCurrency(PocketType.TO))
    const exchangeRate = yield* select(ratesSelectors.exchangeRate(fromCurrency, toCurrency))

    let resultAmountFloat = 0
    let resultPocket: PocketType

    if (currentlyFocusedPocket === PocketType.FROM) {
      resultPocket = PocketType.TO
      resultAmountFloat = pocketFromAmountFloat * exchangeRate
    } else {
      resultPocket = PocketType.FROM
      resultAmountFloat = pocketToAmountFloat / exchangeRate
    }

    let resultAmount = ''
    if (!Number.isNaN(resultAmountFloat)) {
      resultAmount = resultAmountFloat.toFixed(2)
    }
    const currentPocketAmount = yield* select(pocketSelectors.pocketAmount(resultPocket))
    if (resultAmount !== currentPocketAmount) {
      yield put(pocketActions.setPocket(resultPocket, resultAmount))
    }
  } catch (e) {
    console.error(`calculateExchange`, e)
  }
}

export function* baseCurrencyChanged(action: BaseCurrencyChanged) {
  const currentlyFocusedPocket = yield* select(pocketSelectors.focusedPocket)
  if (currentlyFocusedPocket === PocketType.FROM) {
    yield put(pocketActions.setPocket(PocketType.TO, ''))
  } else {
    yield put(pocketActions.setPocket(PocketType.FROM, ''))
  }
}

export function* exchangePockets() {
  // Implementation depends on what we want to achieve
  // we can use rate from redux store (live rate after the delay)
  // or pass the rate in argument (rate that user saw when clicked Exchange)
  // I'm using reducer data (either way it's not a real-world implementation [server])

  try {
    yield put(pocketActions.exchangeOngoing(true))
    yield delay(EXCHANGE_FAKE_DELAY)

    const accounts = yield* select(accountSelectors.accounts)
    const fromCurrency = yield* select(pocketSelectors.pocketCurrency(PocketType.FROM))
    const toCurrency = yield* select(pocketSelectors.pocketCurrency(PocketType.TO))
    const fromAmount = yield* select(pocketSelectors.pocketAmount(PocketType.FROM))
    const exchangeRate = yield* select(ratesSelectors.exchangeRate(fromCurrency, toCurrency))

    const toAmountFloat = parseFloat(fromAmount) * exchangeRate
    const fromAmountFloat = parseFloat(fromAmount)
    const accountFromAmountFloat = parseFloat(accounts[fromCurrency] || '0')
    const accountToAmountFloat = parseFloat(accounts[toCurrency] || '0')

    if (accountFromAmountFloat >= fromAmountFloat) {
      accounts[fromCurrency] = (accountFromAmountFloat - fromAmountFloat).toFixed(2)
      accounts[toCurrency] = (accountToAmountFloat + toAmountFloat).toFixed(2)
      yield put(accountsActions.setAccounts(accounts))
    } else {
      throw new Error(
        `Not enough funds ${parseFloat(fromAmount).toFixed(
          2,
        )} ${fromCurrency}->${toCurrency}, have just ${accountFromAmountFloat.toFixed(2)}`,
      )
    }
  } catch (e) {
    yield put(pocketActions.exchangeError(e))
    console.error(`Exchange error`, e)
  } finally {
    yield put(pocketActions.exchangeOngoing(false))
  }
}

export default function*() {
  yield takeLatest(PocketsActionsConsts.EXCHANGE, exchangePockets)
  yield takeLatest(PocketsActionsConsts.POCKET_CHANGE, pocketChange)
  yield takeLatest(PocketsActionsConsts.BASE_CURRENCY_CHANGED, baseCurrencyChanged)
  yield takeLatest(
    [RatesActionsConsts.SET_RATES, PocketsActionsConsts.FOCUS_POCKET, PocketsActionsConsts.SET_POCKET],
    calculateExchange,
  )
  // yield takeLatest(
  //   [RatesActionsConsts.FETCH_RATES_SUCCESS, PocketsActionsConsts.FOCUS_POCKET, PocketsActionsConsts.CALCULATE_POCKETS],
  //   calculateExchange,
  // )
}

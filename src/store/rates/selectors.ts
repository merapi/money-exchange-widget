import { AppState } from 'store/rootReducer'
import { Currency } from 'store/types'

export const baseCurrency = (state: AppState) => state.rates.baseCurrency

export const rates = (state: AppState) => state.rates.rates

export const exchangeRate = (from: Currency, to: Currency) => (state: AppState) => {
  const currentBaseCurrency = baseCurrency(state)
  if (from === currentBaseCurrency) {
    return state.rates.rates[to]
  }
  throw new Error(`No exchange rates for a given currency ${from}, currently have ${currentBaseCurrency}`)
}

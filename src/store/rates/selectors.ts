import { AppState } from 'store/rootReducer'
import { Currency } from 'store/types'

function isRate(obj: any, to: Currency): obj is number {
  return obj[to] !== undefined
}

export const baseCurrency = (state: AppState) => state.rates.baseCurrency

export const rates = (state: AppState) => state.rates.rates

export const exchangeRate = (from: Currency, to: Currency) => (state: AppState) => {
  const currentBaseCurrency = baseCurrency(state)
  if (from === currentBaseCurrency && state.rates.rates[to]) {
    if (to in state.rates.rates) {
      return state.rates.rates[to] as number
    }
  }
  throw new Error(
    `No exchange rate for a given pair ${from}->${to}, currently only have ${currentBaseCurrency}->${Object.keys(
      state.rates.rates,
    ).join(',')}`,
  )
}

import { AppState } from 'store/rootReducer'
import { Currency } from 'store/types'

export const accounts = (state: AppState) => state.accounts.raw
export const accountBalance = (currency: Currency) => (state: AppState) => {
  if (state.accounts.raw && currency in state.accounts.raw) {
    return state.accounts.raw[currency] as string
  }
  return ''
}

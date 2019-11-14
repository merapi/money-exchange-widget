import { AppState } from 'store/rootReducer'

export const baseCurrency = (state: AppState) => state.rates.baseCurrency
export const rates = (state: AppState) => state.rates.rates

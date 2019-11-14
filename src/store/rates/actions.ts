import { Rate, RatesActionsConsts, FetchRates, LoopFetchRates, FetchRatesSuccess, FetchRatesError } from './types'
import { Currency } from 'store/types'

export const loopFetchRates = (): LoopFetchRates => ({
  type: RatesActionsConsts.LOOP_FETCH_RATES,
})

export const fetchRates = (baseCurrency: Currency): FetchRates => ({
  type: RatesActionsConsts.FETCH_RATES,
  baseCurrency,
})

export const fetchRatesSuccess = (baseCurrency: Currency, rates: Rate): FetchRatesSuccess => ({
  type: RatesActionsConsts.FETCH_RATES_SUCCESS,
  baseCurrency,
  rates,
})

export const fetchRatesError = (error: Error): FetchRatesError => ({
  type: RatesActionsConsts.FETCH_RATES_ERROR,
  error,
})
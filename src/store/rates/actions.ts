import {
  Rate,
  RatesActionsConsts,
  FetchRates,
  StartFetchRates,
  SetRates,
  FetchRatesError,
  StopFetchRates,
} from './types'
import { Currency } from 'store/types'

export const startFetchRates = (): StartFetchRates => ({
  type: RatesActionsConsts.START_FETCH_RATES,
})

export const stopFetchRates = (): StopFetchRates => ({
  type: RatesActionsConsts.STOP_FETCH_RATES,
})

export const fetchRates = (baseCurrency: Currency): FetchRates => ({
  type: RatesActionsConsts.FETCH_RATES,
  baseCurrency,
})

export const setRates = (baseCurrency: Currency, rates: Rate): SetRates => ({
  type: RatesActionsConsts.SET_RATES,
  baseCurrency,
  rates,
})

export const fetchRatesError = (error: Error): FetchRatesError => ({
  type: RatesActionsConsts.FETCH_RATES_ERROR,
  error,
})

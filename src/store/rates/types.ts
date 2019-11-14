import { Currency } from 'store/types'

// Action consts
export enum RatesActionsConsts {
  START_FETCH_RATES = 'START_FETCH_RATES',
  STOP_FETCH_RATES = 'STOP_FETCH_RATES',
  FETCH_RATES = 'FETCH_RATES',
  SET_RATES = 'SET_RATES',
  FETCH_RATES_ERROR = 'FETCH_RATES_ERROR',
}

// Action types
export interface StartFetchRates {
  type: RatesActionsConsts.START_FETCH_RATES
}

export interface StopFetchRates {
  type: RatesActionsConsts.STOP_FETCH_RATES
}

export interface FetchRates {
  type: RatesActionsConsts.FETCH_RATES
  baseCurrency: Currency
}

export interface SetRates {
  type: RatesActionsConsts.SET_RATES
  baseCurrency: Currency
  rates: Rate
}

export interface FetchRatesError {
  type: RatesActionsConsts.FETCH_RATES_ERROR
  error: Error
}

export type RatesActions = StartFetchRates | FetchRates | SetRates

// Data types
export type Rate = {
  [currency in Currency]?: number
}

// State type
export interface RatesState {
  readonly baseCurrency: Currency
  readonly rates: Rate
}

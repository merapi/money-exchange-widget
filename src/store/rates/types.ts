import { Currency } from 'store/types'

// Action consts
export enum RatesActionsConsts {
  LOOP_FETCH_RATES = 'LOOP_FETCH_RATES',
  FETCH_RATES = 'FETCH_RATES',
  FETCH_RATES_SUCCESS = 'FETCH_RATES_SUCCESS',
  FETCH_RATES_ERROR = 'FETCH_RATES_ERROR',
}

// Action types
export interface LoopFetchRates {
  type: RatesActionsConsts.LOOP_FETCH_RATES
}

export interface FetchRates {
  type: RatesActionsConsts.FETCH_RATES
  baseCurrency: Currency
}

export interface FetchRatesSuccess {
  type: RatesActionsConsts.FETCH_RATES_SUCCESS
  baseCurrency: Currency
  rates: Rate
}

export interface FetchRatesError {
  type: RatesActionsConsts.FETCH_RATES_ERROR
  error: Error
}

export type RatesActions = LoopFetchRates | FetchRates | FetchRatesSuccess

// Data types
export type Rate = {
  [currency in Currency]?: number
}

// State type
export interface RatesState {
  readonly baseCurrency: Currency
  readonly rates: Rate
}

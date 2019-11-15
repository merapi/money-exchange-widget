import { Currency } from 'store/types'

// Action consts
export enum PocketsActionsConsts {
  POCKET_CHANGE = 'POCKET_CHANGE',
  SET_POCKET = 'SET_POCKET',
  FOCUS_POCKET = 'FOCUS_POCKET',
  BASE_CURRENCY_CHANGED = 'BASE_CURRENCY_CHANGED',
  EXCHANGE = 'EXCHANGE',
  EXCHANGE_ONGOING = 'EXCHANGE_ONGOING',
  EXCHANGE_ERROR = 'EXCHANGE_ERROR',
  // CALCULATE_POCKETS = 'CALCULATE_POCKETS',
}

// Action types
export interface PocketChange {
  type: PocketsActionsConsts.POCKET_CHANGE
  pocket: PocketType
  amount?: string
  currency?: Currency
}

export interface SetPocket {
  type: PocketsActionsConsts.SET_POCKET
  pocket: PocketType
  amount?: string
  currency?: Currency
}

export interface FocusPocket {
  type: PocketsActionsConsts.FOCUS_POCKET
  pocket: PocketType
}

export interface BaseCurrencyChanged {
  type: PocketsActionsConsts.BASE_CURRENCY_CHANGED
  currency: Currency
}

export interface Exchange {
  type: PocketsActionsConsts.EXCHANGE
}

export interface ExchangeOngoing {
  type: PocketsActionsConsts.EXCHANGE_ONGOING
  is: boolean
}

export interface ExchangeError {
  type: PocketsActionsConsts.EXCHANGE_ERROR
  error: Error | false
}

export type PocketsActions =
  | PocketChange
  | SetPocket
  | FocusPocket
  | BaseCurrencyChanged
  | Exchange
  | ExchangeOngoing
  | ExchangeError

// Data types
export interface Pocket {
  currency: Currency
  amount: string
}
export enum PocketType {
  FROM = 'from',
  TO = 'to',
}

// State type
export interface PocketsState {
  readonly from: Pocket
  readonly to: Pocket
  readonly focused: PocketType
  readonly exchangeOngoing: boolean
  readonly exchangeError: string | undefined
}

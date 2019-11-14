import { Currency } from 'store/types'

// Action consts
export enum PocketsActionsConsts {
  POCKET_CHANGE = 'POCKET_CHANGE',
  SET_POCKET = 'SET_POCKET',
  FOCUS_POCKET = 'FOCUS_POCKET',
  BASE_CURRENCY_CHANGED = 'BASE_CURRENCY_CHANGED',
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

export type PocketsActions = PocketChange | SetPocket | FocusPocket | BaseCurrencyChanged

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
}

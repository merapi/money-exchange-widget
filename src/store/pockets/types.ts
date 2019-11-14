import { Currency } from 'store/types'

// Action consts
export enum PocketsActionsConsts {
  UPDATE_POCKET = 'UPDATE_POCKET',
  BASE_CURRENCY_CHANGED = 'BASE_CURRENCY_CHANGED',
}

// Action types
export interface UpdatePocket {
  type: PocketsActionsConsts.UPDATE_POCKET
  pocket: PocketType
  amount?: string
  currency?: Currency
}

export interface BaseCurrencyChanged {
  type: PocketsActionsConsts.BASE_CURRENCY_CHANGED
  currency: Currency
}

export type PocketsActions = UpdatePocket | BaseCurrencyChanged

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

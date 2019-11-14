import { Currency } from 'store/types'

// Action consts
export enum PocketsActionsConsts {
  POCKET_CHANGE = 'POCKET_CHANGE',
  SET_POCKET = 'SET_POCKET',
  FOCUS_POCKET = 'FOCUS_POCKET',
  CHANGE_BASE_CURRENCY = 'CHANGE_BASE_CURRENCY',
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

export interface ChangeBaseCurrency {
  type: PocketsActionsConsts.CHANGE_BASE_CURRENCY
  currency: Currency
}

export type PocketsActions = PocketChange | SetPocket | FocusPocket | ChangeBaseCurrency

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

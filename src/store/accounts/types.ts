import { Currency } from 'store/types'

// Action consts
export enum AccountsActionsConsts {
  FETCH_ACCOUNTS = 'FETCH_ACCOUNTS',
  FETCH_ACCOUNTS_ERROR = 'FETCH_ACCOUNTS_ERROR',
  SET_ACCOUNTS = 'SET_ACCOUNTS',
}

// Action types
export interface FetchAccounts {
  type: AccountsActionsConsts.FETCH_ACCOUNTS
}
export interface FetchAccountsError {
  type: AccountsActionsConsts.FETCH_ACCOUNTS_ERROR
  error: Error
}
export interface SetAccounts {
  type: AccountsActionsConsts.SET_ACCOUNTS
  accounts: Accounts
}

export type AccountsActions = FetchAccounts | SetAccounts

// Data types
export type Accounts = {
  [currency in Currency]?: string
}

// State type
export interface AccountsState {
  readonly raw: Accounts | null
}

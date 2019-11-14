import { AccountsActionsConsts, SetAccounts, FetchAccounts, FetchAccountsError, Accounts } from './types'

export const fetchAccounts = (): FetchAccounts => ({
  type: AccountsActionsConsts.FETCH_ACCOUNTS,
})

export const fetchAccountsError = (error: Error): FetchAccountsError => ({
  type: AccountsActionsConsts.FETCH_ACCOUNTS_ERROR,
  error,
})

export const setAccounts = (accounts: Accounts): SetAccounts => ({
  type: AccountsActionsConsts.SET_ACCOUNTS,
  accounts,
})

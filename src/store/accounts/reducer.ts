import { AccountsState, AccountsActions, AccountsActionsConsts } from './types'

const initialState: AccountsState = {
  raw: null,
}

export default (state: AccountsState = initialState, action: AccountsActions) => {
  switch (action.type) {
    case AccountsActionsConsts.SET_ACCOUNTS: {
      const { accounts } = action
      return {
        ...state,
        raw: accounts,
      }
    }
  }
  return state
}

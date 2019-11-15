import { AccountsState, AccountsActions, AccountsActionsConsts } from './types'

const initialState: AccountsState = {
  raw: {
    USD: '0',
    PLN: '0',
  },
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

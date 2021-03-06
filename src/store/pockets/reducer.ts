import { PocketsState, PocketsActions, PocketsActionsConsts, PocketType } from './types'

const initialState: PocketsState = {
  from: {
    currency: 'USD',
    amount: '',
  },
  to: {
    currency: 'PLN',
    amount: '',
  },
  focused: PocketType.FROM,
  exchangeOngoing: false,
  exchangeError: undefined,
}

export default (state: PocketsState = initialState, action: PocketsActions): PocketsState => {
  switch (action.type) {
    case PocketsActionsConsts.EXCHANGE_ERROR: {
      const { error } = action
      return {
        ...state,
        exchangeError: error instanceof Error ? error.message : undefined,
      }
    }

    case PocketsActionsConsts.EXCHANGE_ONGOING: {
      return {
        ...state,
        exchangeOngoing: action.is,
        exchangeError: action.is ? undefined : state.exchangeError,
      }
    }

    case PocketsActionsConsts.FOCUS_POCKET: {
      return {
        ...state,
        focused: action.pocket,
      }
    }

    case PocketsActionsConsts.SET_POCKET: {
      const { pocket, currency, amount } = action

      const newState = {
        ...state,
      }
      if (currency !== undefined) {
        newState[pocket] = {
          ...newState[pocket],
          currency,
        }
      }
      if (amount !== undefined) {
        newState[pocket] = {
          ...newState[pocket],
          amount,
        }
      }

      return newState
    }
  }
  return state
}

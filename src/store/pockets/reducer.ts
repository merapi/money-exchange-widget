import { Currency } from '../types'
import { PocketsState, PocketsActions, PocketsActionsConsts, PocketType } from './types'

const initialState: PocketsState = {
  from: {
    currency: 'USD',
    amount: '',
  },
  to: {
    currency: 'USD',
    amount: '',
  },
  focused: PocketType.FROM,
}

export default (state: PocketsState = initialState, action: PocketsActions) => {
  switch (action.type) {
    case PocketsActionsConsts.UPDATE_POCKET: {
      const { pocket, currency, amount } = action
      const from = { ...state.from }
      const to = { ...state.to }

      if (pocket === PocketType.FROM) {
        if (amount !== undefined) {
          const amountFloat = parseFloat(amount)
          if (amountFloat > 9999999) return state

          from.amount = amount
          const toAmount = parseFloat(amount) * 2
          to.amount = Number.isNaN(toAmount) ? '' : toAmount.toFixed(2)
        }
      }

      return {
        ...state,
        from,
        to,
        focused: pocket,
      }
    }
  }
  return state
}

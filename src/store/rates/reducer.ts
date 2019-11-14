import { RatesActions, RatesState } from './types'
import { RatesActionsConsts } from './types'

const initialState: RatesState = {
  baseCurrency: 'USD',
  rates: {
    USD: 1,
  },
}

export default (state: RatesState = initialState, action: RatesActions) => {
  switch (action.type) {
    case RatesActionsConsts.SET_RATES: {
      const { baseCurrency, rates } = action
      return {
        ...state,
        baseCurrency,
        rates,
      }
    }
  }
  return state
}

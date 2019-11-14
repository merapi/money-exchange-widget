import { combineReducers } from 'redux'
import rates from 'store/rates/reducer'
import accounts from 'store/accounts/reducer'
import pockets from 'store/pockets/reducer'

const rootReducer = combineReducers({
  rates,
  accounts,
  pockets,
})

export type AppState = ReturnType<typeof rootReducer>
export default rootReducer

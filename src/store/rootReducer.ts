import { combineReducers } from 'redux'
import rates from 'store/rates/reducer'
import accounts from 'store/accounts/reducer'

const rootReducer = combineReducers({
  rates,
  accounts,
})

export type AppState = ReturnType<typeof rootReducer>
export default rootReducer

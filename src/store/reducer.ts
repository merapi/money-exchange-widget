import { combineReducers } from 'redux'
import rates from 'store/rates/reducer'

const rootReducer = combineReducers({
  rates,
})

export type AppState = ReturnType<typeof rootReducer>
export default rootReducer

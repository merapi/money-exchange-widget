import { AppState } from 'store/rootReducer'
import { PocketType } from './types'

export const pocketAmount = (type: PocketType) => (state: AppState) => state.pockets[type].amount
export const pocketCurrency = (type: PocketType) => (state: AppState) => state.pockets[type].currency
export const focusedPocket = (state: AppState) => state.pockets.focused
export const exchangeOngoing = (state: AppState) => state.pockets.exchangeOngoing
export const exchangeError = (state: AppState) => state.pockets.exchangeError

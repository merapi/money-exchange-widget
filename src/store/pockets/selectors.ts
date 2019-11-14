import { AppState } from 'store/rootReducer'
import { PocketType } from './types'

export const pocketAmount = (type: PocketType) => (state: AppState) => state.pockets[type].amount

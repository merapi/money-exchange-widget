import { PocketsActionsConsts, UpdatePocket, PocketType } from './types'
import { Currency } from 'store/types'

export const updatePocket = (pocket: PocketType, amount?: string, currency?: Currency): UpdatePocket => ({
  type: PocketsActionsConsts.UPDATE_POCKET,
  pocket,
  amount,
  currency,
})

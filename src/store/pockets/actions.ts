import { PocketsActionsConsts, PocketChange, PocketType, SetPocket } from './types'
import { Currency } from 'store/types'

export const pocketChange = (pocket: PocketType, amount?: string, currency?: Currency): PocketChange => ({
  type: PocketsActionsConsts.POCKET_CHANGE,
  pocket,
  amount,
  currency,
})

export const setPocket = (pocket: PocketType, amount?: string, currency?: Currency): SetPocket => ({
  type: PocketsActionsConsts.SET_POCKET,
  pocket,
  amount,
  currency,
})

export const focusPocket = (pocket: PocketType) => ({
  type: PocketsActionsConsts.FOCUS_POCKET,
  pocket,
})

export const baseCurrencyChanged = (currency: Currency) => ({
  type: PocketsActionsConsts.BASE_CURRENCY_CHANGED,
  currency,
})

// export const calculatePockets = () => ({
//   type: PocketsActionsConsts.CALCULATE_POCKETS,
// })

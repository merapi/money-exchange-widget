export type Currency = 'USD' | 'GBP' | 'EUR' | 'PLN'

export type Accounts = {
  [currency in Currency]: number
}

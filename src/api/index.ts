import { Currency } from 'store/types'
import { Rate } from 'store/rates/types'
import { Accounts } from 'store/accounts/types'
import { API_URL } from 'config/consts'

interface FetchOptions {
  signal?: AbortSignal;
}

export interface FetchRatesResponse {
  base: Currency;
  date: string;
  rates: Rate;
}

export interface FetchAccountsResponse {
  raw: Accounts;
}

const finance = {
  fetchRates: async function(baseCurrency: Currency, abortController?: AbortController): Promise<FetchRatesResponse> {
    const options: FetchOptions = {}
    if (abortController) {
      options.signal = abortController.signal
    }
    return await fetch(`${API_URL}/?base=${baseCurrency}`, options).then(response => response.json())
  },
}

const user = {
  fetchAccounts: async function(abortController?: AbortController): Promise<FetchAccountsResponse> {
    const options: FetchOptions = {}
    if (abortController) {
      options.signal = abortController.signal
    }
    return await fetch(`${API_URL}/accounts`, options).then(response => response.json())
  },
}

export default {
  finance,
  user,
}

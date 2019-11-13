import { Currency } from 'store/types'
import { Rate } from 'store/rates/types'

const apiUrl = `http://localhost:9000`

interface FetchOptions {
  signal?: AbortSignal
}

export interface FetchRatesResponse {
  base: Currency
  date: string
  rates: Rate
}

const finance = {
  fetchRates: async function(baseCurrency: Currency, abortController?: AbortController): Promise<FetchRatesResponse> {
    const options: FetchOptions = {}
    if (abortController) {
      options.signal = abortController.signal
    }
    return await fetch(`${apiUrl}/?base=${baseCurrency}`, options).then(response => response.json())
  },
}

const user = {
  loadAccounts: function() {
    // TODO: load from API
  },
}

export default {
  finance,
  user,
}

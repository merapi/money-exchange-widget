import React, { useState, useEffect } from 'react'
import GlobalStyle from 'components/GlobalStyle'
import ExchangeScreen from 'components/ExchangeScreen'
import AccountsList from 'components/AccountsList'
import { Currency } from 'store/types'
import { Accounts } from 'store/accounts/types'
import { useDispatch, useSelector } from 'react-redux'
import * as accountActions from 'store/accounts/actions'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const [exchangeOngoing, setExchangeOngoing] = useState<boolean>(false)

  useEffect(() => {
    dispatch(accountActions.fetchAccounts())
  }, [])

  async function onExchange(from: Currency, to: Currency, amount: string, rate: number, result: string) {
    try {
      setExchangeOngoing(true)
      const responseJson: Accounts | { error: string } = await fetch(
        `http://localhost:9000/exchange?from=${from}&to=${to}&amount=${amount}&rate=${rate}&result=${result}`,
      ).then(response => response.json())
      if ('error' in responseJson) {
        alert(responseJson.error)
      } else {
        // setAccounts(responseJson)
        alert('Exchange done, look on new balance')
      }
    } catch (e) {
      alert('Exchange error, please retry')
    } finally {
      setExchangeOngoing(false)
    }
  }

  return (
    <React.Fragment>
      <GlobalStyle />
      <ExchangeScreen onExchange={onExchange} exchangeOngoing={exchangeOngoing} />
      <AccountsList />
    </React.Fragment>
  )
}

export default App

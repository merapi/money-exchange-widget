import React, { useState, useEffect } from 'react'
import GlobalStyle from 'components/GlobalStyle'
import ExchangeScreen from 'components/ExchangeScreen'
import AccountsList from 'components/AccountsList'
import { Currency } from 'store/types'
import { Accounts } from 'store/accounts/types'
import { useDispatch, useSelector } from 'react-redux'
import * as accountActions from 'store/accounts/actions'
import Button from 'components/Button'

const App: React.FC = () => {
  const dispatch = useDispatch()
  const [showExchangeScreen, setShowExchangeScreen] = useState(false)
  const [exchangeOngoing, setExchangeOngoing] = useState<boolean>(false)

  const store = useSelector(state => state) // store dump at the bottom

  useEffect(() => {
    dispatch(accountActions.fetchAccounts())
  }, [])

  const toggleExchangeScreen = () => {
    setShowExchangeScreen(!showExchangeScreen)
  }

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
      {showExchangeScreen && (
        <ExchangeScreen onCancel={toggleExchangeScreen} onExchange={onExchange} exchangeOngoing={exchangeOngoing} />
      )}
      <AccountsList />
      <Button onClick={toggleExchangeScreen}>{showExchangeScreen ? `Hide` : `Show`} Exchange Screen</Button>
      {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(store, null, 2)}</pre>}
    </React.Fragment>
  )
}

export default App

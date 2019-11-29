import AccountsList from 'components/AccountsList'
import Button from 'components/Button'
import ExchangeScreen from 'components/ExchangeScreen'
import GlobalStyle from 'components/GlobalStyle'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as accountActions from 'store/accounts/actions'

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

  return (
    <React.Fragment>
      <GlobalStyle />
      {showExchangeScreen && <ExchangeScreen onCancel={toggleExchangeScreen} />}
      <AccountsList />
      <Button onClick={toggleExchangeScreen}>{showExchangeScreen ? `Hide` : `Show`} Exchange Screen</Button>
      {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(store, null, 2)}</pre>}
    </React.Fragment>
  )
}

export default App

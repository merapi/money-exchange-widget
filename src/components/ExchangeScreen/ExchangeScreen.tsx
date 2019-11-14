import React, { useEffect, useState } from 'react'
import Pocket from 'components/Pocket'
import styled from 'styled-components'
import { Currency } from 'store/types'
import { SUPPORTED_CURRENCIES } from 'config/consts'
import { useSelector, useDispatch } from 'react-redux'
import * as ratesSelectors from 'store/rates/selectors'
import * as ratesActions from 'store/rates/actions'
import * as accountSelectors from 'store/accounts/selectors'
import * as pocketSelectors from 'store/pockets/selectors'
import * as pocketActions from 'store/pockets/actions'
import { PocketType } from 'store/pockets/types'

interface Props {
  onExchange: (from: Currency, to: Currency, amount: string, rate: number, result: string) => void
  exchangeOngoing: boolean
}

function ExchangeScreen({ onExchange, exchangeOngoing }: Props) {
  const dispatch = useDispatch()

  const accounts = useSelector(accountSelectors.accounts)
  const rates = useSelector(ratesSelectors.rates)
  const pocketFromAmount = useSelector(pocketSelectors.pocketAmount(PocketType.FROM))
  const pocketToAmount = useSelector(pocketSelectors.pocketAmount(PocketType.TO))

  const store = useSelector(state => state) // for quick debugging TODO: remove

  const [currencyFrom, setCurrencyFrom] = useState<Currency>('USD')
  const [currencyTo, setCurrencyTo] = useState<Currency>('PLN')

  const [activePocket, setActivePocket] = useState<Currency>(currencyFrom)

  const [resetTimer, setResetTimer] = useState(0)
  const abortController = new window.AbortController()

  const pairRate = rates[currencyTo] || 0

  useEffect(() => {
    dispatch(ratesActions.loopFetchRates())
  }, [])

  function updatePocketsAmounts(activePocket: Currency) {
    if (activePocket === currencyFrom) {
      // setPocketToAmount(pocketFromAmount ? (parseFloat(pocketFromAmount) * pairRate).toFixed(2) : '')
    } else {
      // setPocketFromAmount(pocketToAmount ? (parseFloat(pocketToAmount) / pairRate).toFixed(2) : '')
    }
  }

  useEffect(() => {
    updatePocketsAmounts(activePocket)
  }, [pairRate])

  const pocketFromBalance = accounts ? (accounts[currencyFrom] || 0).toFixed(2) : ''
  const pocketToBalance = accounts ? (accounts[currencyTo] || 0).toFixed(2) : ''
  const exchangePossible =
    !!pocketFromAmount &&
    parseFloat(pocketFromAmount) > 0 &&
    parseFloat(pocketFromAmount) <= parseFloat(pocketFromBalance)

  const onExchangeClick = () => {
    if (onExchange) {
      const result = onExchange(currencyFrom, currencyTo, pocketFromAmount, pairRate, pocketToAmount)
      console.log('onExchange result', result)
    }
  }
  const onCancelClick = () => {
    alert('Go back')
  }

  const onPocketChange = (pocketType: PocketType) => (amount: string) => {
    dispatch(pocketActions.pocketChange(pocketType, amount))
  }

  const onPocketFromBalanceClick = (balance: string) => () => {
    // setPocketFromAmount(balance)
    // onPocketFromChange(balance)
  }
  const onPocketToBalanceClick = (balance: string) => () => {
    // setPocketToAmount(balance)
    // onPocketToChange(balance)
  }

  const onPocketFocused = (pocketType: PocketType) => () => {
    dispatch(pocketActions.pocketChange(pocketType))
  }

  const changeCurrency = (
    setCurrencyFunction: (currency: Currency) => void,
    currency: Currency,
    isMainPocket: boolean,
  ) => () => {
    setCurrencyFunction(currency)
    if (isMainPocket) {
      setActivePocket(currency)
      // setPocketToAmount('')
      abortController.abort()
      setResetTimer(resetTimer + 1)
    }
  }

  function renderCurrenriesList(
    currentCurrency: string,
    setCurrencyFunction: (currency: Currency) => void,
    isMainPocket = false,
  ) {
    return (
      <CurrencySelect>
        {SUPPORTED_CURRENCIES.map(currency => {
          return (
            <CurrencyOption
              key={currency}
              active={currency === currentCurrency}
              onClick={changeCurrency(setCurrencyFunction, currency as Currency, isMainPocket)}
            >
              {currency}
            </CurrencyOption>
          )
        })}
      </CurrencySelect>
    )
  }

  return (
    <Container>
      {process.env.NODE_ENV === 'development' && <pre>{JSON.stringify(store, null, 2)}</pre>}
      <Header>
        <Button onClick={onCancelClick} background="#282c34" hoverBackground="#3b3e45">
          Cancel
        </Button>
        <Button
          disabled={!exchangePossible || exchangeOngoing}
          onClick={onExchangeClick}
          background="#0074D9"
          hoverBackground="#2499ff"
        >
          {exchangeOngoing ? 'Exchanging...' : 'Exchange'}
        </Button>
      </Header>
      <Pocket
        onChange={onPocketChange(PocketType.FROM)}
        onFocus={onPocketFocused(PocketType.FROM)}
        onBalanceClick={onPocketFromBalanceClick}
        currency={currencyFrom}
        amount={pocketFromAmount}
        balance={pocketFromBalance}
        background="#0074D9"
        focusOnLoad
        mainPocket
        footerComponent={renderCurrenriesList(currencyFrom, setCurrencyFrom, true)}
      />
      <ArrowDown color="#0074D9" />
      <Pocket
        onChange={onPocketChange(PocketType.TO)}
        onFocus={onPocketFocused(PocketType.TO)}
        onBalanceClick={onPocketToBalanceClick}
        currency={currencyTo}
        amount={pocketToAmount}
        balance={pocketToBalance}
        background="#00468c"
        footerComponent={renderCurrenriesList(currencyTo, setCurrencyTo)}
      />
    </Container>
  )
}

const Container = styled.div`
  position: relative;
  max-width: 400px;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

const Button = styled.button<{ background: string; hoverBackground: string }>`
  padding: 5px 10px;
  font-size: 16px;
  background: ${({ background }) => background};
  border: 0;
  border-radius: 5px;
  color: #efefef;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background: ${({ hoverBackground, disabled }) => !disabled && hoverBackground};
  }
  ${({ disabled }) => (disabled ? 'opacity: 0.4;' : '')}
`

const ArrowDown = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid ${({ color }) => color};
`

const CurrencySelect = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
`
const CurrencyOption = styled.div<{ active: boolean }>`
  margin-right: 10px;
  cursor: ${({ active }) => (active ? 'default' : 'pointer')}
  opacity: ${({ active }) => (active ? 1 : 0.5)}
`

export default ExchangeScreen

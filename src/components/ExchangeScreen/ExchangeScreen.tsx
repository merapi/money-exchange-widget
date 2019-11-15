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
import Button from 'components/Button'
import { Container, ArrowDown, CurrencySelect, CurrencyOption, Header } from './Elements'

interface Props {
  onCancel: () => void
  onExchange: (from: Currency, to: Currency, amount: string, rate: number, result: string) => void
  exchangeOngoing: boolean
}

function ExchangeScreen({ onCancel, onExchange, exchangeOngoing }: Props) {
  const dispatch = useDispatch()

  const accounts = useSelector(accountSelectors.accounts)
  const rates = useSelector(ratesSelectors.rates)
  const pocketFromAmount = useSelector(pocketSelectors.pocketAmount(PocketType.FROM))
  const pocketToAmount = useSelector(pocketSelectors.pocketAmount(PocketType.TO))

  const currencyFrom = useSelector(pocketSelectors.pocketCurrency(PocketType.FROM))
  const currencyTo = useSelector(pocketSelectors.pocketCurrency(PocketType.TO))

  useEffect(() => {
    dispatch(ratesActions.startFetchRates())
    return () => {
      dispatch(ratesActions.stopFetchRates())
    }
  }, [])

  const setCurrency = (pocket: PocketType) => (currency: Currency) => {
    dispatch(pocketActions.pocketChange(pocket, undefined, currency))
  }

  const pocketFromBalance = accounts ? (accounts[currencyFrom] || 0).toFixed(2) : ''
  const pocketToBalance = accounts ? (accounts[currencyTo] || 0).toFixed(2) : ''
  const exchangePossible =
    !!pocketFromAmount &&
    parseFloat(pocketFromAmount) > 0 &&
    parseFloat(pocketFromAmount) <= parseFloat(pocketFromBalance)

  const onCancelClick = () => {
    onCancel()
  }

  const onPocketChange = (pocketType: PocketType) => (amount: string) => {
    dispatch(pocketActions.pocketChange(pocketType, amount))
  }

  const onPocketBalanceClick = (pocketType: PocketType) => (balance: string) => () => {
    dispatch(pocketActions.pocketChange(pocketType, balance))
  }

  const onPocketFocused = (pocketType: PocketType) => () => {
    dispatch(pocketActions.focusPocket(pocketType))
  }

  const changeCurrency = (
    setCurrencyFunction: (currency: Currency) => void,
    currency: Currency,
    isMainPocket: boolean,
  ) => () => {
    setCurrencyFunction(currency)
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
      <Header>
        <Button onClick={onCancelClick} background="#282c34" hoverBackground="#3b3e45">
          Cancel
        </Button>
        <Button
          disabled={!exchangePossible || exchangeOngoing}
          onClick={() => {}}
          background="#0074D9"
          hoverBackground="#2499ff"
        >
          {exchangeOngoing ? 'Exchanging...' : 'Exchange'}
        </Button>
      </Header>
      <Pocket
        onChange={onPocketChange(PocketType.FROM)}
        onFocus={onPocketFocused(PocketType.FROM)}
        onBalanceClick={onPocketBalanceClick(PocketType.FROM)}
        currency={currencyFrom}
        amount={pocketFromAmount}
        balance={pocketFromBalance}
        background="#0074D9"
        focusOnLoad
        mainPocket
        footerComponent={renderCurrenriesList(currencyFrom, setCurrency(PocketType.FROM), true)}
      />
      <ArrowDown color="#0074D9" />
      <Pocket
        onChange={onPocketChange(PocketType.TO)}
        onFocus={onPocketFocused(PocketType.TO)}
        onBalanceClick={onPocketBalanceClick(PocketType.TO)}
        currency={currencyTo}
        amount={pocketToAmount}
        balance={pocketToBalance}
        background="#00468c"
        footerComponent={renderCurrenriesList(currencyTo, setCurrency(PocketType.TO))}
      />
    </Container>
  )
}

export default ExchangeScreen

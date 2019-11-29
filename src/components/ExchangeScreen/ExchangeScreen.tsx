import Button from 'components/Button'
import Pocket from 'components/Pocket'
import { SUPPORTED_CURRENCIES } from 'config/consts'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import * as accountSelectors from 'store/accounts/selectors'
import * as pocketActions from 'store/pockets/actions'
import * as pocketSelectors from 'store/pockets/selectors'
import { PocketType } from 'store/pockets/types'
import * as ratesActions from 'store/rates/actions'
import { Currency } from 'store/types'
import { ArrowDown, Container, CurrencyOption, CurrencySelect, ErrorMessage, Header } from './Elements'

interface Props {
  onCancel: () => void
}

function ExchangeScreen({ onCancel }: Props) {
  const dispatch = useDispatch()

  const pocketFromAmount = useSelector(pocketSelectors.pocketAmount(PocketType.FROM))
  const pocketToAmount = useSelector(pocketSelectors.pocketAmount(PocketType.TO))

  const currencyFrom = useSelector(pocketSelectors.pocketCurrency(PocketType.FROM))
  const currencyTo = useSelector(pocketSelectors.pocketCurrency(PocketType.TO))

  const exchangeOngoing = useSelector(pocketSelectors.exchangeOngoing)
  const exchangeError = useSelector(pocketSelectors.exchangeError)

  useEffect(() => {
    dispatch(ratesActions.startFetchRates())
    return () => {
      dispatch(ratesActions.stopFetchRates())
    }
  }, [])

  const setCurrency = (pocket: PocketType) => (currency: Currency) => {
    dispatch(pocketActions.pocketChange(pocket, undefined, currency))
  }

  const onExchange = () => {
    dispatch(pocketActions.exchange())
  }

  const pocketFromBalance = useSelector(accountSelectors.accountBalance(currencyFrom))
  const pocketToBalance = useSelector(accountSelectors.accountBalance(currencyTo))
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
      {exchangeError && <ErrorMessage>{exchangeError}</ErrorMessage>}
      <Header>
        <Button onClick={onCancelClick} background="#282c34" hoverBackground="#3b3e45">
          Cancel
        </Button>
        <Button
          // disabled={!exchangePossible || exchangeOngoing}
          // for error message testing
          disabled={exchangeOngoing}
          onClick={onExchange}
          background="#0074D9"
          hoverBackground="#2499ff"
        >
          {exchangeOngoing ? 'Exchanging...' : 'Exchange'}
        </Button>
      </Header>
      <Pocket
        name={PocketType.FROM}
        onChange={onPocketChange(PocketType.FROM)}
        onFocus={onPocketFocused(PocketType.FROM)}
        onBalanceClick={onPocketBalanceClick(PocketType.FROM)}
        onEnter={onExchange}
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
        name={PocketType.TO}
        onChange={onPocketChange(PocketType.TO)}
        onFocus={onPocketFocused(PocketType.TO)}
        onBalanceClick={onPocketBalanceClick(PocketType.TO)}
        onEnter={onExchange}
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

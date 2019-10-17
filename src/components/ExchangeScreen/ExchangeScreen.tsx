import React, { useEffect, useState, MouseEvent, useRef } from "react"
import useInterval from "hooks/useInterval"
import Pocket from "components/Pocket"
import styled from "styled-components";

const FX_FETCH_INTERVAL = 10 * 1000
const SUPPORTED_CURRENCIES = ['USD', 'GBP', 'EUR', 'PLN']

interface Accounts {
  [currency: string]: number,
}

interface Rates {
  [currency: string]: number,
}

interface Props {
  accounts: Accounts | null,
  onExchange: (from: string, to: string, amount: string, rate: number, result: string) => void
}

function ExchangeScreen({ accounts, onExchange }: Props) {
  const [rates, setRates] = useState<Rates | null>(null)

  const [currencyFrom, setCurrencyFrom] = useState('USD')
  const [currencyTo, setCurrencyTo] = useState('PLN')

  const [activePocket, setActivePocket] = useState(currencyFrom)

  const [pocketFromAmount, setPocketFromAmount] = useState('')
  const [pocketToAmount, setPocketToAmount] = useState('')

  const [every10seconds, setEvery10seconds] = useState(0)

  const [resetTimer, setResetTimer] = useState(0)
  const abortController = new window.AbortController()

  // for delayed responses validation (eg. now exchanging PLN but got json with USD base)
  const refCurrencyFrom = useRef<string>()
  refCurrencyFrom.current = currencyFrom;

  const pairRate = rates !== null ? rates[currencyTo] : 0

  useInterval(() => {
    setEvery10seconds(every10seconds + 1)
  }, FX_FETCH_INTERVAL, resetTimer)

  useEffect(() => {
    async function loadRates(c: string) {
      try {
        const { rates, base } = await fetch(`http://localhost:9000/?base=${currencyFrom}`, { signal: abortController.signal }).then(response => response.json())
        if (base === refCurrencyFrom.current) {
          setRates(rates)
        }
      } catch(error) {
        if (error.name === 'AbortError') {
          console.log(`${currencyFrom} fx request aborted, now ${refCurrencyFrom.current}`)
          return
        }
        throw error
      }
    }
    loadRates(currencyFrom)
  }, [every10seconds, currencyFrom])

  function updatePocketsAmounts(activePocket: string) {
    if (activePocket === currencyFrom) {
      setPocketToAmount(pocketFromAmount ? (parseFloat(pocketFromAmount)*pairRate).toFixed(2) : '')
    } else {
      setPocketFromAmount(pocketToAmount ? (parseFloat(pocketToAmount)/pairRate).toFixed(2) : '')
    }
  }

  useEffect(() => {
    console.log(`updatePocketsAmounts`)
    updatePocketsAmounts(activePocket)
  }, [pairRate])

  const pocketFromBalance = accounts ? accounts[currencyFrom].toFixed(2) : ''
  const pocketToBalance = accounts ? accounts[currencyTo].toFixed(2) : ''
  const exchangePossible = !!pocketFromAmount && parseFloat(pocketFromAmount) > 0 && parseFloat(pocketFromAmount) <= parseFloat(pocketFromBalance)

  const onExchangeClick = () => {
    if (onExchange) {
      const result = onExchange(currencyFrom, currencyTo, pocketFromAmount, pairRate, pocketToAmount)
      console.log(`onExchange result`, result)
    }
  }
  const onCancelClick = () => {
    alert('Go back')
  }

  const onPocketFromChange = (value: string) => {
    if (parseFloat(value) > 9999999) return
    setPocketFromAmount(value)
    setPocketToAmount(value ? (parseFloat(value)*pairRate).toFixed(2) : '')
    setActivePocket(currencyFrom)
  }
  const onPocketToChange = (value: string) => {
    if (parseFloat(value) > 9999999) return
    setPocketToAmount(value)
    setPocketFromAmount(value ? (parseFloat(value)/pairRate).toFixed(2) : '')
    setActivePocket(currencyTo)
  }

  const onPocketFromBalanceClick = (balance: string) => () => {
    setPocketFromAmount(balance)
    onPocketFromChange(balance)
  }
  const onPocketToBalanceClick = (balance: string) => () => {
    setPocketToAmount(balance)
    onPocketToChange(balance)
  }

  const onPocketFocused = (activePocket: string) => () => {
    setActivePocket(activePocket)
    // This is not needed for current use case, but if we want to refetch rates on active pocket change, then we need something like this
    // updatePocketsAmounts(activePocket)
  }

  const changeCurrency = (setCurrencyFunction: (currency: string) => void, currency: string, isMainPocket: boolean) => (event: MouseEvent<HTMLElement>) => {
    setCurrencyFunction(currency)
    if (isMainPocket) {
      setActivePocket(currency)
      setPocketToAmount('')
      abortController.abort()
      setResetTimer(resetTimer + 1)
    }
  }

  function renderCurrenriesList(currentCurrency: string, setCurrencyFunction: (currency: string) => void, isMainPocket: boolean = false) {
    return (
      <CurrencySelect>{SUPPORTED_CURRENCIES.map(currency => {
        return (<CurrencyOption key={currency} active={currency === currentCurrency} onClick={changeCurrency(setCurrencyFunction, currency, isMainPocket)}>{currency}</CurrencyOption>)
      })}</CurrencySelect>
    )
  }

  return (
    <Container>
      <Header>
        <Button onClick={onCancelClick} background="#282c34" hoverBackground="#3b3e45">Cancel</Button>
        <Button disabled={!exchangePossible} onClick={onExchangeClick} background="#0074D9" hoverBackground="#2499ff">Exchange</Button>
      </Header>
      <Pocket
        onChange={onPocketFromChange}
        onFocus={onPocketFocused(currencyFrom)}
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
        onChange={onPocketToChange}
        onFocus={onPocketFocused(currencyTo)}
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

const Button = styled.button<{ background: string, hoverBackground: string }>`
  padding: 5px 10px;
  font-size: 16px;
  background: ${({ background }) => background};
  border: 0;
  border-radius: 5px;
  color: #efefef;
  cursor: ${({ disabled }) => disabled ? `not-allowed` : `pointer`};
  &:hover {
    background: ${({ hoverBackground, disabled }) => !disabled && hoverBackground};
  }
  ${({ disabled }) => disabled ? `opacity: 0.4;` : ``}
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
  cursor: ${({ active }) => active ? 'default' : 'pointer'}
  opacity: ${({ active }) => active ? 1 : 0.5}
`

export default ExchangeScreen

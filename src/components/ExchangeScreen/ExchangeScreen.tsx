import React, { useEffect, useState } from "react"
import useInterval from "hooks/useInterval"
import Pocket from "components/Pocket"
import styled from "styled-components";

const FX_FETCH_INTERVAL = 5 * 1000

interface Accounts {
  [currency: string]: number,
}

interface Rates {
  [currency: string]: number,
}

interface Props {
  accounts: Accounts | null,
}

function ExchangeScreen({ accounts }: Props) {
  const [rates, setRates] = useState<Rates | null>(null)

  const [currencyFrom, setCurrencyFrom] = useState('USD')
  const [currencyTo, setCurrencyTo] = useState('PLN')

  const [activePocket, setActivePocket] = useState(currencyFrom)

  const [pocketFromAmount, setPocketFromAmount] = useState('')
  const [pocketToAmount, setPocketToAmount] = useState('')

  const [every10seconds, setEvery10seconds] = useState(0)

  const pairRate = rates !== null ? rates[currencyTo] : 0

  useInterval(() => {
    setEvery10seconds(every10seconds + 1)
  }, FX_FETCH_INTERVAL)

  useEffect(() => {
    async function loadRates() {
      const { rates } = await fetch(`http://localhost:9000/?base=${currencyFrom}`).then(response => response.json())
      setRates(rates)
    }
    loadRates()
  }, [every10seconds])

  function updatePocketsAmounts(activePocket: string) {
    if (activePocket === currencyFrom) {
      setPocketToAmount(pocketFromAmount ? (parseFloat(pocketFromAmount)*pairRate).toFixed(2) : '')
    } else {
      setPocketFromAmount(pocketToAmount ? (parseFloat(pocketToAmount)/pairRate).toFixed(2) : '')
    }
  }

  useEffect(() => {
    updatePocketsAmounts(activePocket)
  }, [pairRate])

  const pocketFromBalance = accounts ? accounts[currencyFrom].toFixed(2) : ''
  const pocketToBalance = accounts ? accounts[currencyTo].toFixed(2) : ''
  const exchangePossible = !!pocketFromAmount && parseFloat(pocketFromAmount) > 0 && parseFloat(pocketFromAmount) <= parseFloat(pocketFromBalance)

  const onExchangeClick = () => {
    alert('API call')
  }
  const onCancelClick = () => {
    alert('Go back')
  }

  const onPocketFromChange = (value: string) => {
    if (parseFloat(value) > 9999999) return;
    setPocketFromAmount(value)
    setPocketToAmount(value ? (parseFloat(value)*pairRate).toFixed(2) : '')
    setActivePocket(currencyFrom)
  }
  const onPocketToChange = (value: string) => {
    if (parseFloat(value) > 9999999) return;
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

export default ExchangeScreen

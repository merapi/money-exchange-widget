import React, { useState } from "react"
import Pocket from "components/Pocket"
import styled from "styled-components";

function ExchangeScreen() {
  const pocketFromBalance = '500.00'
  const [pocketFromAmount, setPocketFromAmount] = useState('')
  const [pocketToAmount, setPocketToAmount] = useState('')
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
    setPocketToAmount(value ? (parseFloat(value)*4.2816).toFixed(2) : '')
  }
  const onPocketToChange = (value: string) => {
    if (parseFloat(value) > 9999999) return;
    setPocketToAmount(value)
    setPocketFromAmount(value ? (parseFloat(value)/4.2816).toFixed(2) : '')
  }

  const onPocketFromBalanceClick = (balance: string) => () => {
    setPocketFromAmount(balance)
  }
  const onPocketToBalanceClick = (balance: string) => () => {
    setPocketToAmount(balance)
  }

  return (
    <Container>
      <Header>
        <Button onClick={onCancelClick} background="#282c34" hoverBackground="#3b3e45">Cancel</Button>
        <Button disabled={!exchangePossible} onClick={onExchangeClick} background="#0074D9" hoverBackground="#2499ff">Exchange</Button>
      </Header>
      <Pocket
        onChange={onPocketFromChange}
        onBalanceClick={onPocketFromBalanceClick}
        currency="EUR"
        amount={pocketFromAmount}
        balance={pocketFromBalance}
        background="#0074D9"
        focusOnLoad
        mainPocket
      />
      <ArrowDown color="#0074D9" />
      <Pocket
        onChange={onPocketToChange}
        onBalanceClick={onPocketToBalanceClick}
        currency="PLN"
        amount={pocketToAmount}
        balance="0"
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

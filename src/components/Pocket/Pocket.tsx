import React, { useEffect, useRef } from "react"
import styled from "styled-components";
import MoneyInput from "components/MoneyInput";

interface Props {
  mainPocket?: boolean
  currency: string
  amount: string
  balance: string
  onChange: (value: string) => void,
  onBalanceClick: (value: string) => () => void,
  focusOnLoad?: boolean
  className?: string
  background?: string
}

function BarePocket({ mainPocket, currency, amount, balance, className, onChange, onBalanceClick, focusOnLoad }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusOnLoad && inputRef && inputRef.current) {
      inputRef.current.focus();
    }
  }, [focusOnLoad]);

  const overBalance = mainPocket && parseFloat(amount) > parseFloat(balance)

  return (
    <div className={className}>
      <Row>
        <Currency>{currency}</Currency>
        <MoneyInput overBalance={overBalance} innerRef={inputRef} value={amount} onChange={onChange} />
      </Row>
      <Balance overBalance={overBalance} title="Click to use this amount" onClick={onBalanceClick(balance)}>
        You have {balance}
      </Balance>
    </div>
  )
}

const Pocket = styled(BarePocket)`
  background: ${({ background }) => background};
  padding: 20px;
  border-radius: 5px;
// overflow: hidden;
`

const Currency = styled.div`
  font-size: 42px;
  font-weight: 700;
`

const Balance = styled.span<{ overBalance?: boolean }>`
  color: ${({ overBalance }) => overBalance ? `red` : `#94bce0`};
  ${({ overBalance }) => overBalance ? `font-weight: 700` : ``};
  cursor: pointer;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

export default Pocket

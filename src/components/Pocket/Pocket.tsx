import React, { ReactElement, useEffect, useRef } from 'react'
import styled from 'styled-components'
import MoneyInput from 'components/MoneyInput'
import { PocketType } from 'store/pockets/types'

interface Props {
  name: PocketType
  mainPocket?: boolean
  currency: string
  amount: string
  balance: string
  onChange: (value: string) => void
  onFocus: () => void
  onBalanceClick: (value: string) => () => void
  focusOnLoad?: boolean
  className?: string
  background?: string
  footerComponent: ReactElement
  onEnter: () => void
}

function BarePocket({
  name,
  mainPocket,
  currency,
  amount,
  balance,
  className,
  onChange,
  onFocus,
  onBalanceClick,
  focusOnLoad,
  footerComponent,
  onEnter,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (focusOnLoad && inputRef && inputRef.current) {
      inputRef.current.focus()
    }
  }, [focusOnLoad])

  const sign = mainPocket ? '-' : '+'
  const overBalance = mainPocket && parseFloat(amount) > parseFloat(balance)

  return (
    <div className={className}>
      <Row>
        <Currency>{currency}</Currency>
        <MoneyInput
          name={name}
          overBalance={overBalance}
          innerRef={inputRef}
          sign={sign}
          value={amount}
          onChange={onChange}
          onFocus={onFocus}
          onEnter={onEnter}
        />
      </Row>
      <Balance overBalance={overBalance} title="Click to use this amount" onClick={onBalanceClick(balance)}>
        {balance ? `You have ${balance}` : 'Loading...'}
      </Balance>
      {footerComponent}
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
  color: ${({ overBalance }) => (overBalance ? 'red' : '#94bce0')};
  ${({ overBalance }) => (overBalance ? 'font-weight: 700' : '')};
  cursor: pointer;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: baseline;
`

export default Pocket

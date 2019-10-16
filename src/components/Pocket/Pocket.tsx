import React from "react"
import styled from "styled-components";

interface Props {
  currency: string
  amount: number
  balance: number
  className?: string
  background?: string
}

function BarePocket({ currency, amount, balance, className }: Props) {
  return (
    <div className={className}>
      <Row>
        <Currency>{currency}</Currency>
        <Amount>{amount}</Amount>
      </Row>
      <Balance>
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

const Amount = styled.div`
  font-size: 42px;
  font-weight: 700;
`

const Balance = styled.div`
  color: #94bce0;
`

const Row = styled.div`
  display: flex;
  justify-content: space-between;
`

export default Pocket

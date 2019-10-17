import React from "react"
import styled from "styled-components";

interface Accounts {
  [currency: string]: number,
}

interface Props {
  accounts: Accounts | null,
  className?: string,
}

const BareAccounts = ({ accounts, className }: Props) => {

  function listAccounts(accounts: Accounts) {
    return Object.keys(accounts).map(currency => {
      return (
        <div key={currency}>{currency}: {accounts[currency]}</div>
      )
    })
  }

  return (
    <div className={className}>
      {accounts !== null ? listAccounts(accounts) : 'Loading...'}
    </div>
  )
}

const Accounts = styled(BareAccounts)`
  margin: 10px;
`

export default Accounts

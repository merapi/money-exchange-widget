import React from 'react'
import styled from 'styled-components'
import { Accounts, Currency } from '@types'

interface Props {
  accounts: Accounts | null
  className?: string
}

const BareAccountsList = ({ accounts, className }: Props) => {
  function listAccounts(accounts: Accounts) {
    return Object.keys(accounts).map(currency => {
      return (
        <div key={currency}>
          {currency}: {accounts[currency as Currency]}
        </div>
      )
    })
  }

  return (
    <div className={className}>
      <div>Raw accounts from server:</div>
      {accounts !== null ? listAccounts(accounts) : 'Loading...'}
    </div>
  )
}

const AccountsList = styled(BareAccountsList)`
  margin: 10px;
`

export default AccountsList

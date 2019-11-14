import React from 'react'
import styled from 'styled-components'
import { Currency } from 'store/types'
import { Accounts } from 'store/accounts/types'
import * as accountSelectors from 'store/accounts/selectors'
import { useSelector } from 'react-redux'

interface Props {
  className?: string
}

const BareAccountsList = ({ className }: Props) => {
  const accounts = useSelector(accountSelectors.accounts)

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

import React, { useState, useEffect } from 'react';
import GlobalStyle from "components/GlobalStyle";
import ExchangeScreen from "components/ExchangeScreen";
import AccountsList from "components/AccountsList";

interface Accounts {
  [currency: string]: number,
}

const App: React.FC = () => {
  const [accounts, setAccounts] = useState<Accounts | null>(null)

  useEffect(() => {
    async function loadAccounts() {
      const accounts = await fetch(`http://localhost:9000/accounts`).then(response => response.json())
      setAccounts(accounts)
    }
    loadAccounts()
  }, [])

  async function onExchange(from: string, to: string, amount: string, rate: number, result: string) {
    try {
      const responseJson: Accounts = await fetch(`http://localhost:9000/exchange?from=${from}&to=${to}&amount=${amount}&rate=${rate}&result=${result}`).then(response => response.json())
      if ('error' in responseJson) {
        alert(responseJson.error)
      } else {
        setAccounts(responseJson)
      }
      return true
    } catch(e) {
      return false
    }
  }

  return (
    <React.Fragment>
      <GlobalStyle />
      <ExchangeScreen accounts={accounts} onExchange={onExchange} />
      <AccountsList accounts={accounts} />
    </React.Fragment>
  );
}

export default App;

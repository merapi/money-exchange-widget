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

  return (
    <React.Fragment>
      <GlobalStyle />
      <ExchangeScreen accounts={accounts}  />
      <AccountsList accounts={accounts} />
    </React.Fragment>
  );
}

export default App;

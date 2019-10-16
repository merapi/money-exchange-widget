import React from 'react';
import GlobalStyle from "components/GlobalStyle";
import ExchangeScreen from "components/ExchangeScreen";

const App: React.FC = () => {
  return (
    <React.Fragment>
      <GlobalStyle />
      <ExchangeScreen />
    </React.Fragment>
  );
}

export default App;

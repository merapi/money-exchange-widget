import React from "react"
import Pocket from "components/Pocket"
import styled from "styled-components";

function ExchangeScreen() {
  function onExchangeClick() {
    alert('API call')
  }
  function onCancelClick() {
    alert('Go back')
  }

  return (
    <Container>
      <Header>
        <Button onClick={onCancelClick} background="#282c34" hoverBackground="#3b3e45">Cancel</Button>
        <Button onClick={onExchangeClick} background="#0074D9" hoverBackground="#2499ff">Exchange</Button>
      </Header>
      <Pocket currency="EUR" amount={100} balance={500} background="#0074D9" />
      <ArrowDown color="#0074D9" />
      <Pocket currency="PLN" amount={430} balance={0} background="#00468c" />
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
  cursor: pointer;
  &:hover {
    background: ${({ hoverBackground }) => hoverBackground};
  }
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

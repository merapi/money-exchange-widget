import styled from 'styled-components'

export const Container = styled.div`
  position: relative;
  max-width: 400px;
`

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 10px;
`

export const ArrowDown = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 15px solid transparent;
  border-right: 15px solid transparent;
  border-top: 15px solid ${({ color }) => color};
`

export const CurrencySelect = styled.div`
  display: flex;
  margin-top: 20px;
  justify-content: center;
`
export const CurrencyOption = styled.div<{ active: boolean }>`
margin-right: 10px;
cursor: ${({ active }) => (active ? 'default' : 'pointer')}
opacity: ${({ active }) => (active ? 1 : 0.5)}
`

export const ErrorMessage = styled.div`
  background: rgba(255, 0, 0, 0.4);
  padding: 5px 10px;
  border-radius: 8px;
  margin-bottom: 12px;
`

import styled from 'styled-components'

const Button = styled.button<{ background?: string; hoverBackground?: string }>`
  padding: 5px 10px;
  font-size: 16px;
  background: ${({ background }) => (background ? background : `#666`)};
  border: 0;
  border-radius: 5px;
  color: #efefef;
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  &:hover {
    background: ${({ hoverBackground, disabled }) => !disabled && (hoverBackground ? hoverBackground : `#777`)};
  }
  ${({ disabled }) => (disabled ? 'opacity: 0.4;' : '')}
`
export default Button

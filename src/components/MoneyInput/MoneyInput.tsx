import React, { KeyboardEvent, ChangeEvent, RefObject } from "react"
import styled from "styled-components"

interface Props {
  className?: string
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
  innerRef?: RefObject<HTMLInputElement>
  overBalance?: boolean
}

function BareMoneyInput({ className, placeholder, onChange, value, innerRef }: Props) {
  function allowOnlyTwoDecimals(event: ChangeEvent<HTMLInputElement>) {
    const value = event.target.value
    const dotSplitted = value.split(".")
    if (dotSplitted.length === 1 || (dotSplitted.length === 2 && dotSplitted[1].length <= 2 && dotSplitted[0].length > 0)) {
      if (typeof onChange === "function") {
        onChange(value)
      }
    }
  }

  function allowOnlyNumbersAndDot(event: KeyboardEvent) {
    if (
      ![46, 8, 9, 190].includes(event.keyCode) && // allow special keys: delete = 46, backspace = 8, tab = 9, . = 190
      (event.keyCode < 48 || event.keyCode > 57) && // allow numbers: 0 = 48, 9 = 57
      !((event.metaKey || event.ctrlKey) && [65, 67, 86, 88].includes(event.keyCode)) // allow select/copy/paste/cut
    ) {
      event.preventDefault()
    }
  }

  const passProps = {
    className,
    placeholder,
    ref: innerRef,
  }

  return (
    <input {...passProps} placeholder="0" type="text" value={value} onChange={allowOnlyTwoDecimals} onKeyDown={allowOnlyNumbersAndDot} />
  )
}

const MoneyInput = styled(BareMoneyInput)`
  border: none;
  border-radius: 5px;
  padding: 5px 10px;
  font-size: 42px;
  font-weight: 700;
  text-align: right;
  color: #efefef;
  background: transparent;
  width: 100%;
  ::placeholder {
    color: #699cc7;
  }
  :focus {
    text-decoration-line: underline;
    text-decoration-color: #699cc7;
    outline: none;
  }
  ${({ overBalance }) => overBalance ? `
    text-decoration-line: underline !important;
    text-decoration-color: red !important;
  ` : ``}
`

export default MoneyInput

import { createGlobalStyle } from "styled-components"

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css?family=Inconsolata:400,700&display=swap&subset=latin-ext');
  
  * {
    font-family: Inconsolata;
  }

  body {
    background: #282c34;
    color: #efefef;
  }
`

export default GlobalStyle

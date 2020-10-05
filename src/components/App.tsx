import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import React, { FC } from 'react'
import './App.css'
import Main from './Main'

const App: FC = () => {
  return <ThemeProvider>
    <CSSReset />
    <Main />
  </ThemeProvider>
}

export default App

import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import React, { FC } from 'react'
import './App.css'
import Main from './Main'
import { System, SystemContext } from './system'

const App: FC = () => {
  return <ThemeProvider>
    <CSSReset />
    <SystemContext.Provider value={new System(window.innerWidth)}>
      <Main />
    </SystemContext.Provider>
  </ThemeProvider>
}

export default App

import React, { FC } from 'react'
import { ThemeProvider, CSSReset } from '@chakra-ui/core'

import Main from './Main'
import { System, SystemContext } from './system'

import './App.css'

const App: FC = () => {
  return <ThemeProvider>
    <CSSReset />
    <SystemContext.Provider value={new System(window.innerWidth)}>
      <Main />
    </SystemContext.Provider>
  </ThemeProvider>
}

export default App

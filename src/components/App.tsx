import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import React, { FC } from 'react'
import './App.css'
import {
  BoardStateContext,
  PreferenceContext,
  setupSystem,
  SystemContext, useBoardState, usePreference
} from './contexts'
import Main from './Main'

const App: FC = () => {
  const system = setupSystem()

  const boardStateContext = useBoardState()
  const preferenceContext = usePreference()
  return <ThemeProvider>
    <CSSReset />
    <SystemContext.Provider value={system}>
      <BoardStateContext.Provider value={boardStateContext}>
        <PreferenceContext.Provider value={preferenceContext}>
          <Main />
        </PreferenceContext.Provider>
      </BoardStateContext.Provider>
    </SystemContext.Provider>
  </ThemeProvider>
}

export default App

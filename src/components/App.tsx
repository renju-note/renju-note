import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import React, { FC, useEffect } from 'react'
import './App.css'
import {
  BoardStateContext,
  PreferenceContext,
  setupSystem, SystemContext, useBoardState,
  usePreference
} from './contexts'
import Main from './Main'

const App: FC = () => {
  const system = setupSystem()

  const [boardState, setBoardState] = useBoardState()
  useEffect(
    () => setBoardState(boardState),
    [boardState]
  )

  const [preference, setPreference] = usePreference()
  useEffect(
    () => setPreference(preference),
    [preference],
  )
  return <ThemeProvider>
    <CSSReset />
    <SystemContext.Provider value={system}>
      <BoardStateContext.Provider value={[boardState, setBoardState]}>
        <PreferenceContext.Provider value={[preference, setPreference]}>
          <Main />
        </PreferenceContext.Provider>
      </BoardStateContext.Provider>
    </SystemContext.Provider>
  </ThemeProvider>
}

export default App

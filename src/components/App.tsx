import { CSSReset, ThemeProvider } from '@chakra-ui/core'
import React, { FC, useEffect } from 'react'
import './App.css'
import {
  AppStateContext, useAppState,
  PreferenceContext, usePreference,
  SystemContext, setupSystem,
} from './contexts'
import Main from './Main'

const App: FC = () => {
  const system = setupSystem()

  const [appState, setAppState] = useAppState()
  useEffect(
    () => setAppState(appState),
    [appState]
  )

  const [preference, setPreference] = usePreference()
  useEffect(
    () => setPreference(preference),
    [preference],
  )
  return <ThemeProvider>
    <CSSReset />
    <SystemContext.Provider value={system}>
      <AppStateContext.Provider value={[appState, setAppState]}>
        <PreferenceContext.Provider value={[preference, setPreference]}>
          <Main />
        </PreferenceContext.Provider>
      </AppStateContext.Provider>
    </SystemContext.Provider>
  </ThemeProvider>
}

export default App

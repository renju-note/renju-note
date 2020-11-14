import { ChakraProvider } from '@chakra-ui/react'
import React, { FC } from 'react'
import './App.css'
import {
  BoardStateContext,
  PreferenceContext,
  setupSystem,
  SystemContext,
  useBoardState,
  usePreference,
} from './contexts'
import Main from './Main'

const App: FC = () => {
  const system = setupSystem()
  const boardStateContext = useBoardState()
  const preferenceContext = usePreference()
  return (
    <ChakraProvider>
      <SystemContext.Provider value={system}>
        <BoardStateContext.Provider value={boardStateContext}>
          <PreferenceContext.Provider value={preferenceContext}>
            <Main />
          </PreferenceContext.Provider>
        </BoardStateContext.Provider>
      </SystemContext.Provider>
    </ChakraProvider>
  )
}

export default App

import { ChakraProvider } from '@chakra-ui/react'
import React, { FC } from 'react'
import './App.css'
import { BoardStateProvider, PreferenceProvider, SystemProvider } from './contexts'
import Main from './Main'
import theme from './theme'

const Default: FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <SystemProvider>
        <PreferenceProvider>
          <BoardStateProvider>
            <Main />
          </BoardStateProvider>
        </PreferenceProvider>
      </SystemProvider>
    </ChakraProvider>
  )
}

export default Default

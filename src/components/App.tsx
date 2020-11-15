import { ChakraProvider } from '@chakra-ui/react'
import React, { FC } from 'react'
import './App.css'
import { BoardStateProvider, PreferenceProvider, SystemProvider } from './contexts'
import Main from './Main'

const Default: FC = () => {
  return (
    <ChakraProvider>
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

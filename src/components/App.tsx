import React, { FC, useState } from 'react'
import { ThemeProvider, CSSReset, SimpleGrid, Box } from '@chakra-ui/core'

import { State } from '../state'
import Board from './Board'
import Controller from './Controller'

const App: FC = () => {
  return <ThemeProvider>
    <CSSReset />
    <Main />
  </ThemeProvider>
}

const Main: FC = () => {
  const [state, setState] = useState<State>(new State({}))
  return <ThemeProvider>
    <CSSReset />
    <SimpleGrid columns={1} justifyItems="center" spacingY={5}>
      <Box>
        <Board state={state} setState={setState} />
      </Box>
      <Box>
        <Controller state={state} setState={setState}/>
      </Box>
    </SimpleGrid>
  </ThemeProvider>
}

export default App

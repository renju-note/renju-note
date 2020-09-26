import React, { FC, useState } from 'react'
import { ThemeProvider, CSSReset, SimpleGrid, Box } from '@chakra-ui/core'

import { State } from '../state'
import Board from './Board'
import Controller from './Controller'
import { Preference } from './preference'

const App: FC = () => {
  const width = window.innerWidth >= 640 ? 640 : 320
  return <ThemeProvider>
    <CSSReset />
    <Main width={width} />
  </ThemeProvider>
}

type MainProps = {
  width: number
}

const Main: FC<MainProps> = ({
  width,
}) => {
  const [state, setState] = useState<State>(new State({}))
  const [preference, setPreference] = useState<Preference>({
    showIndices: false,
    showOrders: false,
    emphasizeLastMove: false,
    showForbiddens: false,
    showPropertyRows: false,
    showPropertyEyes: false,
  })
  return <ThemeProvider>
    <CSSReset />
    <SimpleGrid columns={1} justifyItems="center" spacingY={5}>
      <Box>
        <Board
          width={width}
          state={state}
          setState={setState}
          preference={preference}
        />
      </Box>
      <Box>
        <Controller
          width={width}
          state={state}
          setState={setState}
          preference={preference}
          setPreference={setPreference}
        />
      </Box>
    </SimpleGrid>
  </ThemeProvider>
}

export default App

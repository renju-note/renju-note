import React, { FC, useState } from 'react'
import { ThemeProvider, CSSReset, SimpleGrid, Box, Button, Flex, Text, Link } from '@chakra-ui/core'

import { State } from '../state'
import { code } from './code'
import Board from './Board'

const App: FC = () => {
  const [state, setState] = useState<State>(new State({}))
  return <ThemeProvider>
    <CSSReset />
    <SimpleGrid columns={1} justifyItems="center" spacingY={4}>
      <Box justifyItems="center">
        <Board state={state} setState={setState} />
      </Box>
      <Flex justifyItems="center">
        <Button variant="ghost" onClick={() => setState(state.undo())}>undo</Button>
        <Button variant="ghost" onClick={() => setState(state.backward())}>←</Button>
        <Button variant="ghost" onClick={() => setState(state.forward())}>→</Button>
      </Flex>
      <Flex width={640} overflowX="scroll" wrap="nowrap">
        {
          state.game.moves.map((p, key) => {
            return <Box key={key} m={1} textAlign="center" width={6}>
              <Link>
                <Text fontFamily="Noto Serif" color="dimgray" fontSize="xs">
                  {key % 5 === 4 ? `${key + 1}` : key % 2 === 0 ? '•' : '⚬' }
                </Text>
                <Text fontFamily="Noto Sans" color="dimgray" fontSize="sm">
                  {code(p)}
                </Text>
              </Link>
            </Box>
          })
        }
      </Flex>
    </SimpleGrid>
  </ThemeProvider>
}

export default App

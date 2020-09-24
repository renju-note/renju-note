import React, { FC } from 'react'
import { SimpleGrid, Box, Flex, IconButton } from '@chakra-ui/core'

import { State } from '../../state'

type DefaultProps = {
  state: State
  setState: (s: State) => void
}

const Default: FC<DefaultProps> = ({
  state,
  setState,
}) => {
  return <SimpleGrid width={640} columns={5} justifyContent="space-between">
    <Box></Box>
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setState(state.undo())}
        icon="settings" aria-label="preference"
        variant="ghost" color="gray.500"
      />
    </Flex>
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setState(state.backward())}
        icon="arrow-left" aria-label="start"
        size="sm" variant="ghost" color="gray.600"
      />
      <IconButton
        onClick={() => setState(state.backward())}
        icon="arrow-back" aria-label="back"
        variant="ghost"
      />
      <IconButton
        onClick={() => setState(state.forward())}
        icon="arrow-forward" aria-label="forward"
        variant="ghost"
      />
      <IconButton
        onClick={() => setState(state.forward())}
        icon="arrow-right" aria-label="last"
        size="sm" variant="ghost" color="gray.600"
      />
    </Flex>
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setState(state.undo())}
        icon="small-close" aria-label="undo"
        variant="ghost" color="gray.600"
      />
    </Flex>
    <Box></Box>
  </SimpleGrid>
}

export default Default

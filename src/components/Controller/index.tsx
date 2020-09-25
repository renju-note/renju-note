import React, { FC } from 'react'
import { SimpleGrid, Flex, Button, IconButton } from '@chakra-ui/core'

import { State } from '../../state'

type DefaultProps = {
  state: State
  setState: (s: State) => void
}

const Default: FC<DefaultProps> = ({
  state,
  setState,
}) => {
  return <SimpleGrid width={640} columns={3} justifyContent="space-between" alignItems="center">
    <Flex justifyContent="space-around" alignItems="center">
      <IconButton
        icon="settings" aria-label="preference"
        variant="ghost" color="gray.500"
      />
      <IconButton
        onClick={() => setState(state.reset())}
        icon="close" aria-label="reset"
        variant="ghost" color="gray.600"
        isDisabled={!state.canReset}
      />
    </Flex>
    <Flex justifyContent="center" alignItems="center">
      <IconButton
        onClick={() => setState(state.toStart())}
        icon="arrow-left" aria-label="to start"
        size="sm" variant="ghost" color="gray.600"
        isDisabled={state.isStart}
      />
      <IconButton
        onClick={() => setState(state.backward())}
        icon="arrow-back" aria-label="backward"
        variant="ghost"
        isDisabled={state.isStart}
      />
      <Button
        variant="ghost" fontFamily="Noto Serif" fontWeight="normal"
      >
        {state.cursor}
      </Button>
      <IconButton
        onClick={() => setState(state.forward())}
        icon="arrow-forward" aria-label="forward"
        variant="ghost"
        isDisabled={state.isLast}
      />
      <IconButton
        onClick={() => setState(state.toLast())}
        icon="arrow-right" aria-label="to last"
        size="sm" variant="ghost" color="gray.600"
        isDisabled={state.isLast}
      />
    </Flex>
    <Flex justifyContent="space-around" alignItems="center">
      <IconButton
        onClick={() => setState(state.undo())}
        icon="small-close" aria-label="undo"
        variant="ghost" color="gray.600"
        isDisabled={!state.canUndo}
      />
      <IconButton
        icon="download" aria-label="download"
        variant="ghost" color="gray.600"
      />
    </Flex>
  </SimpleGrid>
}

export default Default

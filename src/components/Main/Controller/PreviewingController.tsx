import { Button, Flex } from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [boardState, setBoardState] = useContext(BoardStateContext)
  return <Flex width={system.W} justifyContent="space-evenly" alignItems="center">
    <Button
      width={system.W / 4}
      variantColor="blue"
      onClick={() => setBoardState(boardState.setGameFromPreviewing())}
    >
      Open
    </Button>
    <Button
      width={system.W / 4}
      onClick={() => setBoardState(boardState.unsetPreviewingGame())}
    >
      Cancel
    </Button>
  </Flex>
}

export default Default

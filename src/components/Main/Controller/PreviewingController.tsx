import { Button, Flex } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { BoardStateContext, SystemContext, TabsContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { setIndex } = useContext(TabsContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
  return (
    <Flex width={system.W} justifyContent="space-evenly" alignItems="center">
      <Button
        width={system.W / 4}
        colorScheme="blue"
        onClick={() => {
          setBoardState(boardState.setGameFromPreviewing())
          setIndex(1)
        }}
      >
        Open
      </Button>
      <Button width={system.W / 4} onClick={() => setBoardState(boardState.unsetPreviewingGame())}>
        Cancel
      </Button>
    </Flex>
  )
}

export default Default

import { Button, Flex } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { BoardState, TabName } from '../../../state'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { setBoardState } = useContext(BoardStateContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  return (
    <Flex width={system.W} justifyContent="space-evenly" alignItems="center">
      <Button
        width={system.W / 4}
        colorScheme="blue"
        onClick={() => {
          if (advancedState.previewingGame === undefined) return
          setBoardState(new BoardState({ mainGame: advancedState.previewingGame }))
          setAdvancedState(advancedState.unsetPreviewingGame().setTab(TabName.detail))
        }}
      >
        Open
      </Button>
      <Button
        width={system.W / 4}
        onClick={() => setAdvancedState(advancedState.unsetPreviewingGame())}
      >
        Cancel
      </Button>
    </Flex>
  )
}

export default Default

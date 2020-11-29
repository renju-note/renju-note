import { Button, Flex } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { TabName } from '../../../state/advanced'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  return (
    <Flex width={system.W} justifyContent="space-evenly" alignItems="center">
      <Button
        width={system.W / 4}
        colorScheme="blue"
        onClick={() => {
          if (advancedState.previewingGame === undefined) return
          setBoardState(
            boardState.setGame(
              advancedState.previewingGame.main,
              advancedState.previewingGame.gameid
            )
          )
          setAdvancedState(advancedState.unsetPreview().setTab(TabName.detail))
        }}
      >
        Open
      </Button>
      <Button width={system.W / 4} onClick={() => setAdvancedState(advancedState.unsetPreview())}>
        Cancel
      </Button>
    </Flex>
  )
}

export default Default

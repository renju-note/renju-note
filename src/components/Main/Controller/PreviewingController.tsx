import { Button, ButtonGroup } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { BoardState, TabName } from '../../../state'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { setBoardState } = useContext(BoardStateContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  return (
    <ButtonGroup
      width="100%"
      justifyContent="space-evenly"
      alignItems="center"
      size={system.buttonSize}
    >
      <Button
        width="25%"
        colorScheme="blue"
        onClick={() => {
          if (advancedState.previewingGame === undefined) return
          setBoardState(new BoardState({ mainGame: advancedState.previewingGame }))
          setAdvancedState(advancedState.setPreviewingGame(undefined).setTab(TabName.detail))
        }}
      >
        Open
      </Button>
      <Button
        width="25%"
        onClick={() => setAdvancedState(advancedState.setPreviewingGame(undefined))}
      >
        Cancel
      </Button>
    </ButtonGroup>
  )
}

export default Default

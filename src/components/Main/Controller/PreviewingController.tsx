import { Button, ButtonGroup } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { BoardState, EditMode, GameState } from '../../../state'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
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
          setBoardState(new BoardState({ mainGame: boardState.mainGame }))
          setAdvancedState(advancedState.setHiddenGame(undefined))
        }}
      >
        Open
      </Button>
      <Button
        width="25%"
        onClick={() => {
          const originalGame = advancedState.hiddenGame ?? new GameState()
          setBoardState(boardState.setMainGame(originalGame).setMode(EditMode.mainMoves))
          setAdvancedState(advancedState.setHiddenGame(undefined))
        }}
      >
        Cancel
      </Button>
    </ButtonGroup>
  )
}

export default Default

import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import Board from '../Board'
import { AdvancedStateContext, BoardStateContext } from '../contexts'

const MAIN_BOARD_ID = 'main-board'

const Default: FC = () => {
  const { boardState, setBoardState } = useContext(BoardStateContext)
  const { advancedState } = useContext(AdvancedStateContext)
  const onClickPoint = (p: Point) => {
    if (advancedState.previewingGame !== undefined) return
    setBoardState(boardState.edit(p))
  }
  return <Board id={MAIN_BOARD_ID} onClickPoint={onClickPoint} />
}

export default Default

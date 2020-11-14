import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import Board from '../Board'
import { BoardStateContext } from '../contexts'

const MAIN_BOARD_ID = 'main-board'

const Default: FC = () => {
  const {boardState, setBoardState} = useContext(BoardStateContext)
  const onClickPoint = (p: Point) => setBoardState(boardState.edit(p))
  return <Board
    id={MAIN_BOARD_ID}
    onClickPoint={onClickPoint}
  />
}

export default Default

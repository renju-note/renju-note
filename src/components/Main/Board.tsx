import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import Board from '../Board'
import { AppStateContext } from '../contexts'

const MAIN_BOARD_ID = 'main-board'

const Default: FC = () => {
  const [appState, setAppState] = useContext(AppStateContext)
  const onClickPoint = (p: Point) => setAppState(appState.edit(p))
  return <Board
    id={MAIN_BOARD_ID}
    onClickPoint={onClickPoint}
  />
}

export default Default

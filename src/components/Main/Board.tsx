import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { AppStateContext } from '../appState'
import BoardComponent from '../BoardComponent'

const MAIN_BOARD_ID = 'main-board'

const Default: FC = () => {
  const [appState, setAppState] = useContext(AppStateContext)
  const onClickPoint = (p: Point) => setAppState(appState.move(p))
  return <BoardComponent
    id={MAIN_BOARD_ID}
    onClickPoint={onClickPoint}
    board={appState.board}
    moves={appState.gameState.moves}
  />
}

export default Default

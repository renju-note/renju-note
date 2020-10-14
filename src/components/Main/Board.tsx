import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { AppStateContext } from '../appState'
import BoardComponent from '../BoardComponent'

const Default: FC = () => {
  const [appState, setAppState] = useContext(AppStateContext)
  const onClickPoint = (p: Point) => setAppState(appState.move(p))
  return <BoardComponent
    onClickPoint={onClickPoint}
    board={appState.board}
    moves={appState.moves}
  />
}

export default Default

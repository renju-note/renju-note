import { FC, useContext } from 'react'
import { Point } from '../../rule'
import Board from '../common/Board'
import { BasicContext } from '../contexts'

const MAIN_BOARD_ID = 'main-board'

const Default: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const onClickPoint = (p: Point) => setBoardState(boardState.edit(p))
  return <Board id={MAIN_BOARD_ID} state={boardState} onClickPoint={onClickPoint} />
}

export default Default

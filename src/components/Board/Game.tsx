import { FC, useContext } from 'react'
import { Point } from '../../rule'
import { BoardOption, EditMode } from '../../state'
import { BoardStateContext, PreferenceContext, PreferenceOption, SystemContext } from '../contexts'
import { Moves, Orders, PointMarker } from './common'

const Default: FC = () => {
  const { preference } = useContext(PreferenceContext)
  const { boardState, gameState } = useContext(BoardStateContext)
  const game = boardState.mode === EditMode.preview ? gameState.main : gameState.current
  return (
    <g>
      {preference.has(PreferenceOption.emphasizeLastMove) && game.lastMove && (
        <LastMove point={game.lastMove} />
      )}
      <Moves moves={game.moves} invert={boardState.options.has(BoardOption.invertMoves)} />
      {preference.has(PreferenceOption.showOrders) && (
        <Orders moves={game.moves} invert={boardState.options.has(BoardOption.invertMoves)} />
      )}
    </g>
  )
}

export const LastMove: FC<{ point: Point }> = ({ point }) => {
  const system = useContext(SystemContext)
  const [cx, cy] = system.c(point)
  const r = ((system.C / 2) * 21) / 20
  return <PointMarker shape="circle" cx={cx} cy={cy} r={r} color="violet" opacity={1.0} />
}

export default Default

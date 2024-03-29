import { FC, useContext } from 'react'
import { Point } from 'renjukit'
import { Game } from '../../../rule'
import { PointsState } from '../../../state'
import { SystemContext } from '../../contexts'
import { PointMarker, Stone } from './common'

type Props = {
  game: Game
  showOrders: boolean
  showLastMove: boolean
  freeBlacks: PointsState
  freeWhites: PointsState
}

const Default: FC<Props> = ({ game, showOrders, showLastMove, freeBlacks, freeWhites }) => {
  return (
    <g>
      {showLastMove && game.lastMove && <LastMove point={game.lastMove} />}
      <Moves points={game.moves} inverted={game.inverted} showOrders={showOrders} />
      <FreeStones points={freeBlacks.points} black={true} />
      <FreeStones points={freeWhites.points} black={false} />
    </g>
  )
}

const Moves: FC<{ points: Point[]; inverted: boolean; showOrders: boolean }> = ({
  points,
  inverted,
  showOrders,
}) => (
  <g>
    {points.map((p, key) => {
      const black = inverted ? key % 2 === 1 : key % 2 === 0
      return (
        <Stone key={key} point={p} black={black} label={showOrders ? `${key + 1}` : undefined} />
      )
    })}
  </g>
)

const FreeStones: FC<{ points: Point[]; black: boolean }> = ({ points, black }) => (
  <g>
    {points.map((p, key) => (
      <Stone key={key} point={p} black={black} />
    ))}
  </g>
)

const LastMove: FC<{ point: Point }> = ({ point }) => {
  const system = useContext(SystemContext)
  const [cx, cy] = system.c(point)
  const r = ((system.C / 2) * 21) / 20
  return <PointMarker shape="circle" cx={cx} cy={cy} r={r} color="violet" opacity={1.0} />
}

export default Default

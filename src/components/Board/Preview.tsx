import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { AppStateContext, SystemContext } from '../contexts'

const Default: FC = () => {
  const appState = useContext(AppStateContext)[0]
  if (appState.previewingGame === undefined) return <></>
  const game = appState.previewingGame
  return <g>
    <Overlay />
    {
      game.lastMove && <LastMove
        point={game.lastMove}
      />
    }
    <Stones
      black={true}
      points={game.blacks}
    />
    <Stones
      black={false}
      points={game.whites}
    />
    <Orders
      moves={game.moves}
      invert={false}
    />
  </g>
}

const Overlay: FC = () => {
  const system = useContext(SystemContext)
  return <rect
    x={0}
    y={0}
    width={system.W}
    height={system.W}
    rx={system.C / 4}
    ry={system.C / 4}
    fill="lavender"
    opacity={0.7}
  />
}

const Stones: FC<{ black: boolean, points: Point[]}> = ({
  black,
  points,
}) => {
  const stones = points.map(
    (p, key) => <Stone key={key} black={black} point={p} />
  )
  return <g>
    { stones }
  </g>
}

const Orders: FC<{moves: Point[], invert: boolean}> = ({
  moves,
  invert,
}) => {
  const system = useContext(SystemContext)
  const texts = moves.map(
    ([x, y], key) => {
      const black = invert ? key % 2 !== 0 : key % 2 === 0
      return <text
        key={key}
        x={system.cx(x)} y={system.cy(y)}
        fill={black ? 'whitesmoke' : 'dimgray'}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize={system.orderFontSize}
        fontFamily="Noto Serif"
      >
        {key + 1}
      </text>
    }
  )
  return <g>
    { texts }
  </g>
}

const Stone: FC<{black: boolean, point: Point}> = ({
  black,
  point,
}) => {
  const system = useContext(SystemContext)
  const [cx, cy] = system.c(point)
  const r = system.C / 2 * 9 / 10
  return <circle
    cx={cx} cy={cy} r={r}
    strokeWidth={system.stoneStrokeWidth}
    stroke="#333333"
    strokeOpacity="0.7"
    fill={black ? '#333333' : 'white'}
  />
}

const LastMove: FC<{ point: Point }> = ({
  point,
}) => {
  const system = useContext(SystemContext)
  const [cx, cy] = system.c(point)
  const r = system.C / 2 * 21 / 20
  return <circle
    cx={cx} cy={cy} r={r}
    fill="violet"
  />
}

export default Default

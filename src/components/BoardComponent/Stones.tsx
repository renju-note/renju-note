import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { SystemContext, PreferenceContext, AppStateContext } from '../contexts'

const Default: FC = () => {
  const preference = useContext(PreferenceContext)[0]
  const appState = useContext(AppStateContext)[0]
  const moves = appState.gameState.moves
  return <g>
    {
      preference.emphasizeLastMove && moves.length >= 1 &&
      <LastMarker
        point={moves[moves.length - 1]}
      />
    }
    <Stones
      black={true}
      points={appState.blacks}
    />
    <Stones
      black={false}
      points={appState.whites}
    />
    {
      preference.showOrders &&
      <Orders
        moves={appState.gameState.moves}
      />
    }
  </g>
}

type StonesProps = {
  black: boolean
  points: Point[]
}

const Stones: FC<StonesProps> = ({
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

type OrdersProps = {
  moves: Point[]
}

const Orders: FC<OrdersProps> = ({
  moves,
}) => {
  const system = useContext(SystemContext)
  const texts = moves.map(
    ([x, y], key) => {
      const black = key % 2 === 0
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

type StoneProps = {
  black: boolean
  point: Point
}

const Stone: FC<StoneProps> = ({
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

type LastMarkerProps = {
  point: Point
}

const LastMarker: FC<LastMarkerProps> = ({
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

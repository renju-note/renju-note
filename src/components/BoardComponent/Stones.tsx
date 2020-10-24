import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { SystemContext } from '../contexts'

type DefaultProps = {
  moves?: Point[] | undefined
  stones?: {
    blacks: Point[]
    whites: Point[]
  } | undefined
  showOrders?: boolean | undefined
  emphasizeLastMove?: boolean | undefined
}

const Default: FC<DefaultProps> = ({
  moves,
  stones,
  showOrders,
  emphasizeLastMove,
}) => {
  if (moves === undefined && stones === undefined) throw new Error('moves or stones required')
  if (moves === undefined && showOrders) throw new Error('moves required to show orders')
  if (moves === undefined && emphasizeLastMove) throw new Error('moves required to emphasize last')
  const blacks = stones ? stones.blacks : moves!.filter((_, i) => i % 2 === 0)
  const whites = stones ? stones.whites : moves!.filter((_, i) => i % 2 === 1)
  return <g>
    {
      emphasizeLastMove && moves && moves.length >= 1 &&
      <LastMarker
        point={moves[moves.length - 1]}
      />
    }
    <Stones
      black={true}
      points={blacks}
    />
    <Stones
      black={false}
      points={whites}
    />
    {
      moves && showOrders &&
      <Orders
        moves={moves}
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

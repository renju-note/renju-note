import React, { FC } from 'react'

import { Point } from '../../rule'
import { N, C } from './coordinate'

type DefaultProps = {
  moves?: Point[] | undefined
  stones?: {
    blacks: Point[]
    whites: Point[]
  } | undefined
  showOrders?: boolean | undefined
  emphasizeLast?: boolean | undefined
}

const Default: FC<DefaultProps> = ({
  moves,
  stones,
  showOrders,
  emphasizeLast,
}) => {
  if (moves === undefined && stones === undefined) throw new Error('moves or stones required')
  if (moves === undefined && showOrders) throw new Error('moves required to show orders')
  if (moves === undefined && emphasizeLast) throw new Error('moves required to emphasize last')
  const blacks = stones ? stones.blacks : moves!.filter((_, i) => i % 2 === 0)
  const whites = stones ? stones.whites : moves!.filter((_, i) => i % 2 === 1)
  return <g>
    { moves && moves.length >= 1 && emphasizeLast && <LastMarker point={moves[moves.length - 1]} />}
    <Stones
      black={true}
      points={blacks}
    />
    <Stones
      black={false}
      points={whites}
    />
    { moves && showOrders && <Orders moves={moves} />}
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
  const circles = points.map(
    (p, key) => {
      return <Stone key={key} black={black} point={p} />
    }
  )
  return <g>
    { circles }
  </g>
}

type OrdersProps = {
  moves: Point[]
}

const Orders: FC<OrdersProps> = ({
  moves,
}) => {
  const texts = moves.map(
    ([x, y], key) => {
      const fill = key % 2 === 0 ? 'whitesmoke' : 'dimgray'
      return <text
        key={key}
        x={x * C} y={(N - y + 1) * C}
        textAnchor="middle"
        dominantBaseline="central"
        fontFamily="Noto Serif"
        fontSize="16px"
        fill={fill}
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
  const [x, y] = point
  return <circle
    cx={x * C} cy={(N - y + 1) * C}
    r={C / 2 - 2}
    fill={black ? 'black' : 'white'}
    stroke="black" strokeWidth={1.5} strokeOpacity={black ? 0.3 : 0.7}
  />
}

type LastMarkerProps = {
  point: Point
}

const LastMarker: FC<LastMarkerProps> = ({
  point
}) => {
  const [x, y] = point
  return <circle
    cx={x * C} cy={(N - y + 1) * C}
    r={C / 2 + 1}
    fill="violet"
  />
}

export default Default

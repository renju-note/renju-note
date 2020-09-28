import React, { FC } from 'react'

import { Point } from '../../rule'
import { N, toClassName } from './coordinate'

type DefaultProps = {
  C: number
  moves?: Point[] | undefined
  stones?: {
    blacks: Point[]
    whites: Point[]
  } | undefined
  showOrders?: boolean | undefined
  emphasizeLastMove?: boolean | undefined
}

const Default: FC<DefaultProps> = ({
  C,
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
        C={C}
        point={moves[moves.length - 1]}
      />
    }
    <Stones
      C={C}
      black={true}
      points={blacks}
    />
    <Stones
      C={C}
      black={false}
      points={whites}
    />
    {
      moves && showOrders &&
      <Orders
        C={C}
        moves={moves}
      />
    }
  </g>
}

type StonesProps = {
  C: number
  black: boolean
  points: Point[]
}

const Stones: FC<StonesProps> = ({
  C,
  black,
  points,
}) => {
  const circles = points.map(
    (p, key) => {
      return <Stone C={C} key={key} black={black} point={p} />
    }
  )
  return <g>
    { circles }
  </g>
}

type OrdersProps = {
  C: number
  moves: Point[]
}

const Orders: FC<OrdersProps> = ({
  C,
  moves,
}) => {
  const texts = moves.map(
    ([x, y], key) => {
      return <text
        key={key}
        className={`order ${toClassName(key % 2 === 0)}`}
        dominantBaseline="central"
        x={x * C} y={(N - y + 1) * C}
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
  C: number
  black: boolean
  point: Point
}

const Stone: FC<StoneProps> = ({
  C,
  black,
  point,
}) => {
  const [x, y] = point
  return <circle
    className={`stone ${toClassName(black)}`}
    cx={x * C} cy={(N - y + 1) * C}
    r={(C / 2) * 9 / 10}
  />
}

type LastMarkerProps = {
  C: number
  point: Point
}

const LastMarker: FC<LastMarkerProps> = ({
  C,
  point,
}) => {
  const [x, y] = point
  return <circle
    className="lastMarker"
    cx={x * C} cy={(N - y + 1) * C}
    r={(C / 2) * 21 / 20}
  />
}

export default Default

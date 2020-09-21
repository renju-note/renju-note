import React, { FC } from 'react'

import { N, C } from './foundation'
import { Point } from '../rule'

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
    ([x, y], key) => {
      return <circle
        key={key}
        cx={x * C} cy={(N - y + 1) * C}
        r={C / 2 - 2}
        fill={black ? 'black' : 'white'}
        stroke={black ? undefined : 'black'}
      />
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
        x={x * C - 5} y={(N - y + 1) * C + 5}
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

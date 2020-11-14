import React, { FC, useContext } from 'react'
import { Point } from '../../../rule'
import { SystemContext } from '../../contexts'

export const Moves: FC<{ moves: Point[], invert?: boolean }> = ({
  moves,
  invert = false,
}) => {
  const stones = moves.map(
    (p, key) => {
      const black = invert ? key % 2 !== 0 : key % 2 === 0
      return <Stone key={key} black={black} point={p} />
    }
  )
  return <g>
    { stones }
  </g>
}

export const Stones: FC<{ black: boolean, points: Point[]}> = ({
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

export const Orders: FC<{ moves: Point[], invert?: boolean }> = ({
  moves,
  invert = false,
}) => {
  const orders = moves.map(
    (p, key) => {
      const black = invert ? key % 2 !== 0 : key % 2 === 0
      return <Order key={key} black={black} point={p} order={key + 1} />
    }
  )
  return <g>
    { orders }
  </g>
}

export const LastMove: FC<{ point: Point }> = ({
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

const Order: FC<{black: boolean, point: Point, order: number }> = ({
  black,
  point,
  order,
}) => {
  const system = useContext(SystemContext)
  const [x, y] = point
  return <text
    x={system.cx(x)} y={system.cy(y)}
    fill={black ? 'whitesmoke' : 'dimgray'}
    textAnchor="middle"
    dominantBaseline="central"
    fontSize={system.orderFontSize}
    fontFamily="Noto Serif"
  >
    {`${order}`}
  </text>
}

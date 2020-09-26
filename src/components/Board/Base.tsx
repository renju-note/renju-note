import React, { FC } from 'react'

import { Point } from '../../rule'
import { xCode, yCode } from '../code'
import { N, INDICES, cx, cy } from './coordinate'

type DefaultProps = {
  C: number
  showIndices: boolean
}

const Default: FC<DefaultProps> = ({
  C,
  showIndices,
}) => {
  return <g>
    <Rulers C={C} />
    <Stars C={C} />
    {showIndices && <Indices C={C} />}
  </g>
}

const Rulers: FC<{C: number}> = ({ C }) => {
  const verticalLines = INDICES.map(
    (x, key) => <line
      key={key}
      x1={cx(x, C)} y1={cy(1, C)} x2={cx(x, C)} y2={cy(N, C)}
      stroke="darkgray" strokeWidth={2}
    />
  )
  const horizontalLines = INDICES.map(
    (y, key) => <line
      key={key}
      x1={cx(1, C)} y1={cy(y, C)} x2={cx(N, C)} y2={cy(y, C)}
      stroke="darkgray" strokeWidth={2}
    />
  )
  return <g>
    {verticalLines}
    {horizontalLines}
  </g>
}

const Stars: FC<{
  C: number
  points?: Point[] | undefined
}> = ({
  C,
  points = [[4, 4], [4, 12], [8, 8], [12, 4], [12, 12]],
}) => {
  return <g>
    {
      points.map(
        ([x, y], key) => <circle
          key={key}
          cx={cx(x, C)} cy={cy(y, C)} r={C * 1 / 10}
          fill="gray"
        />
      )
    }
  </g>
}

const Indices: FC<{C: number}> = ({ C }) => {
  const fill = 'gray'
  const fontSize = `${C * 4 / 10}px`
  const fontFamily = 'Noto Sans'
  const xIndices = INDICES.map(
    (x, key) => <text
      key={key}
      x={cx(x, C)} y={cy(1, C) + C}
      textAnchor="middle"
      fontFamily={fontFamily} fontSize={fontSize}
      fill={fill}
    >
      {xCode(x)}
    </text>
  )
  const yIndices = INDICES.map(
    (y, key) => <text
      key={key}
      x={cx(1, C) - C * 0.8} y={cy(y, C)}
      textAnchor="middle" dominantBaseline="central"
      fontFamily={fontFamily} fontSize={fontSize}
      fill={fill}
    >
      {yCode(y)}
    </text>
  )
  return <g>
    { xIndices }
    { yIndices }
  </g>
}

export default Default

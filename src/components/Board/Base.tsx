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
      className="ruler"
      x1={cx(x, C)} y1={cy(1, C)} x2={cx(x, C)} y2={cy(N, C)}
    />
  )
  const horizontalLines = INDICES.map(
    (y, key) => <line
      key={key}
      className="ruler"
      x1={cx(1, C)} y1={cy(y, C)} x2={cx(N, C)} y2={cy(y, C)}
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
          className="star"
          cx={cx(x, C)} cy={cy(y, C)} r={C * 1 / 10}
        />
      )
    }
  </g>
}

const Indices: FC<{C: number}> = ({ C }) => {
  const xIndices = INDICES.map(
    (x, key) => <text className="index"
      key={key}
      x={cx(x, C)} y={cy(1, C) + C}
    >
      {xCode(x)}
    </text>
  )
  const yIndices = INDICES.map(
    (y, key) => <text className="index"
      key={key}
      x={cx(1, C) - C * 0.8} y={cy(y, C)}
      dominantBaseline="central"
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

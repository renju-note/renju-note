import React, { FC } from 'react'

import { N, C, INDICES, xChar } from './foundation'
import { Point } from '../rule'

type DefaultProps = {
  showIndices: boolean
}

const Default: FC<DefaultProps> = ({
  showIndices,
}) => {
  return <g>
    <Rulers />
    <Stars points={[[4, 4], [4, 12], [8, 8], [12, 4], [12, 12]]} />
    {showIndices && <Indices />}
  </g>
}

const Rulers: FC = () => {
  const verticalLines = INDICES.map(
    (x, key) => <line
      key={key}
      x1={x * C} y1={1 * C}
      x2={x * C} y2={N * C}
      stroke="darkgray"
      strokeWidth={2}
    />
  )
  const horizontalLines = INDICES.map(
    (y, key) => <line
      key={key}
      y1={(N - y + 1) * C} x1={1 * C}
      y2={(N - y + 1) * C} x2={N * C}
      stroke="darkgray"
      strokeWidth={2}
    />
  )
  return <g>
    {verticalLines}
    {horizontalLines}
  </g>
}

type StarsProps = {
  points: Point[]
}

const Stars: FC<StarsProps> = ({
  points,
}) => {
  const stars = points.map(
    ([x, y], key) => <circle
      key={key}
      cx={x * C} cy={(N - y + 1) * C}
      r={C / 10}
      fill="gray"
    />
  )
  return <g>
    {stars}
  </g>
}

const Indices: FC = () => {
  const xIndices = INDICES.map(
    (x, key) => <text
      key={key}
      x={x * C - 6} y={(N + 1) * C}
      fontSize="16px"
      fill="gray"
    >
      {xChar(x)}
    </text>
  )
  const yIndices = INDICES.map(
    (y, key) => <text
      key={key}
      x={0} y={(N - y + 1) * C + 6}
      fill="gray"
    >
      {y}
    </text>
  )
  return <g>
    {xIndices}
    {yIndices}
  </g>
}

export default Default

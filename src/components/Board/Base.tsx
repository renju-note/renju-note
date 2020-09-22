import React, { FC } from 'react'

import { Point } from '../../rule'
import { xCode, yCode } from '../code'
import { N, C, INDICES, cx, cy } from './coordinate'

type DefaultProps = {
  showIndices: boolean
}

const Default: FC<DefaultProps> = ({
  showIndices,
}) => {
  return <g>
    <Rulers />
    <Stars />
    {showIndices && <Indices />}
  </g>
}

const Rulers: FC = () => {
  const verticalLines = INDICES.map(
    (x, key) => <line
      key={key}
      x1={cx(x)} y1={cy(1)} x2={cx(x)} y2={cy(N)}
      stroke="darkgray" strokeWidth={2}
    />
  )
  const horizontalLines = INDICES.map(
    (y, key) => <line
      key={key}
      x1={cx(1)} y1={cy(y)} x2={cx(N)} y2={cy(y)}
      stroke="darkgray" strokeWidth={2}
    />
  )
  return <g>
    {verticalLines}
    {horizontalLines}
  </g>
}

const Stars: FC<{
  points?: Point[] | undefined
}> = ({
  points = [[4, 4], [4, 12], [8, 8], [12, 4], [12, 12]],
}) => {
  return <g>
    {
      points.map(
        ([x, y], key) => <circle
          key={key}
          cx={cx(x)} cy={cy(y)} r={C * 0.1}
          fill="gray"
        />
      )
    }
  </g>
}

const Indices: FC = () => {
  const fill = 'gray'
  const fontSize = `${Math.round(C * 0.4)}px`
  const fontFamily = 'Noto Sans'
  const xIndices = INDICES.map(
    (x, key) => <text
      key={key}
      x={cx(x)} y={cy(1) + C}
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
      x={cx(1) - C * 0.8} y={cy(y)}
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

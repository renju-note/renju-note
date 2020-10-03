import React, { FC, useContext } from 'react'
import { xCode, yCode } from '../code'
import { SystemContext } from '../system'

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
  const system = useContext(SystemContext)
  const verticalLines = system.indices.map(
    (x, key) => <line
      key={key}
      className="ruler"
      x1={system.cx(x)} y1={system.cy(1)} x2={system.cx(x)} y2={system.cy(system.N)}
    />
  )
  const horizontalLines = system.indices.map(
    (y, key) => <line
      key={key}
      className="ruler"
      x1={system.cx(1)} y1={system.cy(y)} x2={system.cx(system.N)} y2={system.cy(y)}
    />
  )
  return <g>
    {verticalLines}
    {horizontalLines}
  </g>
}

const Stars: FC = () => {
  const system = useContext(SystemContext)
  const points = [[4, 4], [4, 12], [8, 8], [12, 4], [12, 12]]
  return <g>
    {
      points.map(
        ([x, y], key) => <circle
          key={key}
          className="star"
          cx={system.cx(x)} cy={system.cy(y)} r={system.C / 10}
        />
      )
    }
  </g>
}

const Indices: FC = () => {
  const system = useContext(SystemContext)
  const xIndices = system.indices.map(
    (x, key) => <text className="index"
      key={key}
      x={system.cx(x)} y={system.cy(1) + system.P}
    >
      {xCode(x)}
    </text>
  )
  const yIndices = system.indices.map(
    (y, key) => <text className="index"
      key={key}
      x={system.P * 3 / 10} y={system.cy(y)}
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

import React, { FC, useContext } from 'react'
import { EditMode } from '../../state'
import { BoardStateContext, PreferenceContext, PreferenceOption, SystemContext } from '../contexts'

const Default: FC = () => {
  const { boardState } = useContext(BoardStateContext)
  const { preference } = useContext(PreferenceContext)
  return (
    <g>
      <Rulers />
      <Stars />
      {preference.has(PreferenceOption.showIndices) && <Indices />}
      {boardState.mode === EditMode.preview && <Overlay />}
    </g>
  )
}

const Rulers: FC = () => {
  const system = useContext(SystemContext)
  const verticalLines = system.indices.map((x, key) => (
    <line
      key={key}
      x1={system.cx(x)}
      y1={system.cy(1)}
      x2={system.cx(x)}
      y2={system.cy(system.N)}
      stroke="darkgray"
      strokeLinecap="round"
      strokeWidth={system.rulerStrokeWidth}
    />
  ))
  const horizontalLines = system.indices.map((y, key) => (
    <line
      key={key}
      x1={system.cx(1)}
      y1={system.cy(y)}
      x2={system.cx(system.N)}
      y2={system.cy(y)}
      stroke="darkgray"
      strokeLinecap="round"
      strokeWidth={system.rulerStrokeWidth}
    />
  ))
  return (
    <g>
      {verticalLines}
      {horizontalLines}
    </g>
  )
}

const Stars: FC = () => {
  const system = useContext(SystemContext)
  const points = [
    [4, 4],
    [4, 12],
    [8, 8],
    [12, 4],
    [12, 12],
  ]
  return (
    <g>
      {points.map(([x, y], key) => (
        <circle
          key={key}
          cx={system.cx(x)}
          cy={system.cy(y)}
          r={system.C / 10}
          stroke="none"
          fill="gray"
        />
      ))}
    </g>
  )
}

const Indices: FC = () => {
  const system = useContext(SystemContext)
  const xIndices = system.indices.map((x, key) => (
    <text
      key={key}
      x={system.cx(x)}
      y={system.cy(1) + (system.P * 19) / 20 - system.indexPadding}
      textAnchor="middle"
      fill="gray"
      fontSize={system.indexFontSize}
      fontFamily="Roboto"
    >
      {system.xCode(x)}
    </text>
  ))
  const yIndices = system.indices.map((y, key) => (
    <text
      key={key}
      x={(system.P * 5) / 20 + system.indexPadding}
      y={system.cy(y)}
      textAnchor="middle"
      dominantBaseline="central"
      fill="gray"
      fontSize={system.indexFontSize}
      fontFamily="Roboto"
    >
      {system.yCode(y)}
    </text>
  ))
  return (
    <g>
      {xIndices}
      {yIndices}
    </g>
  )
}

const Overlay: FC = () => {
  const system = useContext(SystemContext)
  return (
    <rect
      x={0}
      y={0}
      width={system.W}
      height={system.W}
      rx={system.C / 4}
      ry={system.C / 4}
      fill="lavender"
      opacity={0.7}
    />
  )
}

export default Default

import { FC, useContext } from 'react'
import { SystemContext } from '../../contexts'

type Props = {
  showIndices: boolean
  showOverlay: boolean
  colorBase: boolean
}

const Default: FC<Props> = ({ showIndices, showOverlay, colorBase }) => {
  const stroke = colorBase ? 'gray' : 'darkgray'
  return (
    <g>
      {colorBase && <Base />}
      <Rulers stroke={stroke} />
      <Stars />
      {showIndices && <Indices stroke={stroke} />}
      {showOverlay && <Overlay />}
    </g>
  )
}

const Base: FC = () => {
  const system = useContext(SystemContext)
  return (
    <rect
      x={0}
      y={0}
      width={system.W}
      height={system.W}
      rx={system.C / 4}
      ry={system.C / 4}
      stroke="none"
      fill="moccasin"
    />
  )
}

type StrokeProps = {
  stroke: string
}

const Rulers: FC<StrokeProps> = ({ stroke }) => {
  const system = useContext(SystemContext)
  const verticalLines = system.indices.map((x, key) => (
    <line
      key={key}
      x1={system.cx(x)}
      y1={system.cy(1)}
      x2={system.cx(x)}
      y2={system.cy(system.N)}
      stroke={stroke}
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
      stroke={stroke}
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

const Indices: FC<StrokeProps> = ({ stroke }) => {
  const system = useContext(SystemContext)
  const xIndices = system.indices.map((x, key) => (
    <text
      key={key}
      x={system.cx(x)}
      y={system.cy(1) + (system.P * 19) / 20 - system.indexPadding}
      textAnchor="middle"
      fill={stroke}
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
      fill={stroke}
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

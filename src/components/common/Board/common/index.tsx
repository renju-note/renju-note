import { FC, useContext } from 'react'
import { Point } from 'renjukit'
import { SystemContext } from '../../../contexts'

export const Stone: FC<{ black: boolean; point: Point; label?: string }> = ({
  black,
  point,
  label,
}) => {
  const system = useContext(SystemContext)
  const [cx, cy] = system.c(point)
  const r = ((system.C / 2) * 9) / 10
  return (
    <g>
      <circle
        cx={cx}
        cy={cy}
        r={r}
        strokeWidth={system.stoneStrokeWidth}
        stroke="#222222"
        strokeOpacity="0.7"
        fill={black ? '#222222' : 'white'}
      />
      {label && (
        <Text
          label={label}
          cx={cx}
          cy={cy}
          fontColor={black ? 'whitesmoke' : 'dimgray'}
          fontSize={system.orderFontSize}
          fontFamily="Noto Serif"
        />
      )}
    </g>
  )
}

export const SegmentMarker: FC<{
  start: [number, number]
  end: [number, number]
  stroke: string
  strokeWidth: number
  strokeDasharray: string
}> = ({ start, end, stroke, strokeWidth, strokeDasharray }) => {
  const [x1, y1] = start
  const [x2, y2] = end
  const orthogonal = x1 === x2 || y1 === y2
  return (
    <g>
      {orthogonal && (
        <line
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
          stroke="white"
          strokeWidth={strokeWidth}
          strokeLinecap="butt"
          opacity="0.6"
        />
      )}
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={stroke}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeDasharray={strokeDasharray}
        opacity="0.4"
      />
    </g>
  )
}

export const PointMarker: FC<ShapeProps & FigureProps & TextProps> = ({
  shape,
  cx,
  cy,
  r,
  color,
  opacity,
  label,
  fontSize,
  fontFamily,
  fontColor,
}) => {
  const figure = (() => {
    switch (shape) {
      case 'circle':
        return <Circle cx={cx} cy={cy} r={r} color={color} opacity={opacity} />
      case 'diamond':
        return <Diamond cx={cx} cy={cy} r={r} color={color} opacity={opacity} />
      case 'cross':
        return <Cross cx={cx} cy={cy} r={r} color={color} opacity={opacity} />
    }
  })()
  const text = label !== undefined && (
    <Text
      label={label}
      cx={cx}
      cy={cy}
      fontColor={fontColor}
      fontSize={fontSize}
      fontFamily={fontFamily}
    />
  )
  return (
    <g>
      {figure}
      {text}
    </g>
  )
}

type ShapeProps = {
  shape: 'circle' | 'diamond' | 'cross'
}

type FigureProps = {
  cx: number
  cy: number
  r: number
  color: string
  opacity: number
}

type TextProps = {
  cx: number
  cy: number
  label?: string
  fontSize?: string
  fontColor?: string
  fontFamily?: string
}

const Circle: FC<FigureProps> = ({ cx, cy, r, color, opacity }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} stroke="none" fill={color} fillOpacity={opacity} />
  </g>
)

const Diamond: FC<FigureProps> = ({ cx, cy, r, color, opacity }) => (
  <g transform={`rotate(45, ${cx}, ${cy})`}>
    <rect
      x={cx - r}
      y={cy - r}
      width={r * 2}
      height={r * 2}
      stroke="none"
      fill={color}
      fillOpacity={opacity}
    />
  </g>
)

const Cross: FC<FigureProps> = ({ cx, cy, r, color, opacity }) => {
  const [x1, x2, y1, y2] = [cx - r, cx + r, cy + r, cy - r]
  const strokeWidth = (r * 6) / 10
  return (
    <g>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
      <line
        x1={x1}
        y1={y2}
        x2={x2}
        y2={y1}
        stroke={color}
        strokeWidth={strokeWidth}
        opacity={opacity}
      />
    </g>
  )
}

const Text: FC<TextProps> = ({ label, cx, cy, fontColor, fontSize, fontFamily }) => (
  <text
    x={cx}
    y={cy}
    textAnchor="middle"
    dominantBaseline="central"
    fill={fontColor}
    fontSize={fontSize}
    fontFamily={fontFamily}
  >
    {label}
  </text>
)

import { FC, useContext } from 'react'
import { Board, Point, Property, RowKind } from '../../rule'
import { SystemContext } from '../contexts'

type Props = {
  board: Board
  showRows: boolean
  showEyes: boolean
  showForbiddens: boolean
}

const Default: FC<Props> = ({ board, showRows, showEyes, showForbiddens }) => {
  return (
    <g>
      {showRows && (
        <>
          <Rows properties={board.properties(true, RowKind.two)} black />
          <Rows properties={board.properties(true, RowKind.sword)} black />
          <Rows properties={board.properties(true, RowKind.three)} black />
          <Rows properties={board.properties(true, RowKind.four)} black />
          <Rows properties={board.properties(false, RowKind.two)} />
          <Rows properties={board.properties(false, RowKind.sword)} />
          <Rows properties={board.properties(false, RowKind.three)} />
          <Rows properties={board.properties(false, RowKind.four)} />
        </>
      )}
      {showEyes && (
        <>
          <Eyes properties={board.properties(true, RowKind.three)} black />
          <Eyes properties={board.properties(true, RowKind.four)} black emphasized />
          <Eyes properties={board.properties(false, RowKind.three)} />
          <Eyes properties={board.properties(false, RowKind.four)} emphasized />
        </>
      )}
      {showForbiddens && <Forbiddens points={board.forbiddens} />}
    </g>
  )
}

type PropertiesProps = {
  black?: boolean
  properties: Property[]
  emphasized?: boolean
}

const Rows: FC<PropertiesProps> = ({ black, properties }) => {
  const system = useContext(SystemContext)
  const stroke = black ? 'blue' : 'darkgreen'
  const segments = properties.map((p, key) => (
    <Segment
      key={key}
      start={system.c(p.start)}
      end={system.c(p.end)}
      stroke={stroke}
      strokeWidth={system.propertyRowStrokeWidth}
      strokeDasharray={system.propertyRowStrokeDasharray}
    />
  ))
  return <g>{segments}</g>
}

const Segment: FC<{
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

const Eyes: FC<PropertiesProps> = ({ black, properties, emphasized }) => {
  const system = useContext(SystemContext)
  const r = (system.C * 2) / 10
  const color = black ? 'blue' : 'darkgreen'
  const gs = properties.map((p, m) => {
    const rects = p.eyes.map((e, n) => {
      const [cx, cy] = system.c(e)
      return emphasized ? (
        <Diamond key={n} cx={cx} cy={cy} r={r} color={color} opacity={0.7} />
      ) : (
        <Circle key={n} cx={cx} cy={cy} r={r} color={color} opacity={0.4} />
      )
    })
    return <g key={m}>{rects}</g>
  })
  return <g>{gs}</g>
}

const Forbiddens: FC<{ points: Point[] }> = ({ points }) => {
  const system = useContext(SystemContext)
  const r = (system.C * 2) / 10
  const crosses = points.map((p, key) => {
    const [cx, cy] = system.c(p)
    return <Cross key={key} cx={cx} cy={cy} r={r} color="red" opacity={0.5} />
  })
  return <g>{crosses}</g>
}

type MarkerProps = {
  cx: number
  cy: number
  r: number
  color: string
  opacity: number
}

const Diamond: FC<MarkerProps> = ({ cx, cy, r, color, opacity }) => (
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

const Circle: FC<MarkerProps> = ({ cx, cy, r, color, opacity }) => (
  <g>
    <circle cx={cx} cy={cy} r={r} stroke="none" fill={color} fillOpacity={opacity} />
  </g>
)

const Cross: FC<MarkerProps> = ({ cx, cy, r, color, opacity }) => {
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

export default Default

import { FC, useContext } from 'react'
import { Board, Point, Property, RowKind } from '../../../rule'
import { SystemContext } from '../../contexts'
import { PointMarker, SegmentMarker } from './common'

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
    <SegmentMarker
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

const Eyes: FC<PropertiesProps> = ({ black, properties, emphasized }) => {
  const system = useContext(SystemContext)
  const r = (system.C * 2) / 10
  const color = black ? 'blue' : 'darkgreen'
  const gs = properties.map((p, m) => {
    const rects = p.eyes.map((e, n) => {
      const [cx, cy] = system.c(e)
      return emphasized ? (
        <PointMarker shape="diamond" key={n} cx={cx} cy={cy} r={r} color={color} opacity={0.7} />
      ) : (
        <PointMarker key={n} shape="circle" cx={cx} cy={cy} r={r} color={color} opacity={0.4} />
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
    return <PointMarker key={key} shape="cross" cx={cx} cy={cy} r={r} color="red" opacity={0.5} />
  })
  return <g>{crosses}</g>
}

export default Default

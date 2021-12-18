import { FC, useContext } from 'react'
import { Board, Player, Point, Row, RowKind, wrapBoard } from 'renjukit'
import { wrapRow } from 'renjukit/dist/board/row'
import { SystemContext } from '../../contexts'
import { PointMarker, SegmentMarker } from './common'

type Props = {
  board: Board
  showRows: boolean
  showEyes: boolean
  showForbiddens: boolean
}

const Default: FC<Props> = ({ board, showRows, showEyes, showForbiddens }) => {
  const board_ = wrapBoard(board)
  return (
    <g>
      {showRows && (
        <>
          <Rows rows={board_.rows(Player.black, RowKind.two)} black />
          <Rows rows={board_.rows(Player.black, RowKind.sword)} black />
          <Rows rows={board_.rows(Player.black, RowKind.three)} black />
          <Rows rows={board_.rows(Player.black, RowKind.four)} black />
          <Rows rows={board_.rows(Player.white, RowKind.two)} />
          <Rows rows={board_.rows(Player.white, RowKind.sword)} />
          <Rows rows={board_.rows(Player.white, RowKind.three)} />
          <Rows rows={board_.rows(Player.white, RowKind.four)} />
        </>
      )}
      {showEyes && (
        <>
          <Eyes rows={board_.rows(Player.black, RowKind.three)} black />
          <Eyes rows={board_.rows(Player.black, RowKind.four)} black emphasized />
          <Eyes rows={board_.rows(Player.white, RowKind.three)} />
          <Eyes rows={board_.rows(Player.white, RowKind.four)} emphasized />
        </>
      )}
      {showForbiddens && <Forbiddens points={board_.forbiddens().map(([_, p]) => p)} />}
    </g>
  )
}

type RowsProps = {
  black?: boolean
  rows: Row[]
  emphasized?: boolean
}

const Rows: FC<RowsProps> = ({ black, rows }) => {
  const system = useContext(SystemContext)
  const stroke = black ? 'blue' : 'darkgreen'
  const segments = rows.map((row, key) => (
    <SegmentMarker
      key={key}
      start={system.c(row.start)}
      end={system.c(row.end)}
      stroke={stroke}
      strokeWidth={system.propertyRowStrokeWidth}
      strokeDasharray={system.propertyRowStrokeDasharray}
    />
  ))
  return <g>{segments}</g>
}

const Eyes: FC<RowsProps> = ({ black, rows, emphasized }) => {
  const system = useContext(SystemContext)
  const r = (system.C * 2) / 10
  const color = black ? 'blue' : 'darkgreen'
  const gs = rows.map((row, m) => {
    const row_ = wrapRow(row)
    const rects = row_.eyes().map((e, n) => {
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

import { FC, useContext } from 'react'
import { PointsState, SegmentsState } from '../../../state'
import { SystemContext } from '../../contexts'
import { PointMarker, SegmentMarker } from './common'

type Props = {
  segments: SegmentsState
  points: PointsState
  sequence: PointsState
  showPointsLabel: boolean
}

const Default: FC<Props> = ({ segments, points, sequence, showPointsLabel }) => (
  <g>
    <Segments state={segments} />
    <Points state={points} showLabel={showPointsLabel} />
    <Sequence state={sequence} />
  </g>
)

const Segments: FC<{ state: SegmentsState }> = ({ state }) => {
  const system = useContext(SystemContext)
  const segments = state.segments.map(([start, end], key) => (
    <SegmentMarker
      key={key}
      start={system.c(start)}
      end={system.c(end)}
      stroke="darkviolet"
      strokeWidth={system.propertyRowStrokeWidth}
      strokeDasharray={system.propertyRowStrokeDasharray}
    />
  ))
  const start = (() => {
    if (state.start === undefined) return undefined
    const [cx, cy] = system.c(state.start)
    const r = (system.C / 16) * 3
    return <PointMarker shape="circle" cx={cx} cy={cy} r={r} color="darkviolet" opacity={0.8} />
  })()
  return (
    <g>
      {segments}
      {start}
    </g>
  )
}

const Points: FC<{ state: PointsState; showLabel: boolean }> = ({ state, showLabel }) => {
  const system = useContext(SystemContext)
  const r = (system.C * 3) / 8
  const markers = state.points.map((p, key) => {
    const [cx, cy] = system.c(p)
    const text = showLabel ? 'abcdefghijklmnopqrstuvwxyz'.charAt(key) : undefined
    return (
      <PointMarker
        key={key}
        shape="circle"
        cx={cx}
        cy={cy}
        r={r}
        color="silver"
        opacity={0.8}
        label={text}
        fontColor="#333333"
        fontSize={system.markerFontSize}
        fontFamily="Noto Serif"
      />
    )
  })
  return <g>{markers}</g>
}

const Sequence: FC<{ state: PointsState }> = ({ state }) => {
  const system = useContext(SystemContext)
  const r = (system.C * 3) / 8
  const last = state.points.length - 1
  const markers = state.points.map((p, key) => {
    const isFirst = key === 0
    const isLast = key === last
    const [cx, cy] = system.c(p)
    return (
      <PointMarker
        key={key}
        shape="circle"
        cx={cx}
        cy={cy}
        r={r}
        color={isFirst || isLast ? 'indigo' : 'white'}
        opacity={0.8}
        label={`${key + 1}`}
        fontColor={isFirst || isLast ? 'white' : 'indigo'}
        fontSize={system.markerFontSize}
        fontFamily="Roboto"
      />
    )
  })
  return <g>{markers}</g>
}

export default Default

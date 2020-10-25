import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { SystemContext, AppStateContext, PreferenceContext } from '../contexts'

const Default: FC = () => {
  const appState = useContext(AppStateContext)[0]
  return <g>
    <Lines lines={appState.markerLines.lines}/>
    {
      appState.markerLines.start !== 'empty' &&
      <LineStart point={appState.markerLines.start} />
    }
    <Points points={appState.markerPoints.points}/>
  </g>
}

const Points: FC<{ points: Point[]}> = ({
  points,
}) => {
  const system = useContext(SystemContext)
  const preference = useContext(PreferenceContext)[0]
  const r = system.C * 3 / 8
  const markers = points.map(
    (p, key) => {
      const [cx, cy] = system.c(p)
      return <g key={key}>
        <circle
          cx={cx} cy={cy} r={r}
          fill="silver"
          opacity="0.8"
        />
        {
          preference.showMarkerAlphabets &&
          <text
            x={cx} y={cy}
            fill='#333333'
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={system.orderFontSize}
            fontFamily="Noto Serif"
          >
            {'abcdefghijklmnopqrstuvwxyz'.charAt(key)}
          </text>
        }
      </g>
    }
  )
  return <g>
    { markers }
  </g>
}

const Lines: FC<{ lines: [Point, Point][]}> = ({
  lines,
}) => {
  const system = useContext(SystemContext)
  const markers = lines.map(
    ([start, end], key) => {
      const [x1, y1] = system.c(start)
      const [x2, y2] = system.c(end)
      return <g key={key}>
        { (x1 === x2 || y1 === y2) &&
          <line
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="white"
            strokeWidth={system.propertyRowStrokeWidth}
            strokeLinecap="butt"
            opacity="0.6"
          />
        }
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="darkviolet"
          strokeWidth={system.propertyRowStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={system.propertyRowStrokeDasharray}
          opacity="0.4"
        />
      </g>
    }
  )
  return <g>
    { markers }
  </g>
}

const LineStart: FC<{ point: Point}> = ({
  point,
}) => {
  const system = useContext(SystemContext)
  const [cx, cy] = system.c(point)
  const r = system.C / 16 * 3
  return <circle
    cx={cx} cy={cy} r={r}
    fill="darkviolet"
    opacity="0.8"
  />
}

export default Default

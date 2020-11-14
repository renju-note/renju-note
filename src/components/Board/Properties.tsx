import React, { FC, useContext } from 'react'
import { Point, Property } from '../../rule'
import { BoardStateContext, PreferenceContext, PreferenceOption, SystemContext } from '../contexts'

const Default: FC = () => {
  const board = useContext(BoardStateContext)[0].board
  const preference = useContext(PreferenceContext)[0]
  return <g>
    {
      preference.has(PreferenceOption.showPropertyRows) &&
      <>
        <PropertyRows
          black={true}
          properties={board.properties.get(true, 'two')}
        />
        <PropertyRows
          black={true}
          properties={board.properties.get(true, 'closedThree')}
        />
        <PropertyRows
          black={false} properties={board.properties.get(false, 'two')}
        />
        <PropertyRows
          black={false}
          properties={board.properties.get(false, 'closedThree')}
        />
        <PropertyRows
          black={true}
          properties={board.properties.get(true, 'three')}
        />
        <PropertyRows
          black={true}
          properties={board.properties.get(true, 'four')}
        />
        <PropertyRows
          black={false} properties={board.properties.get(false, 'three')}
        />
        <PropertyRows
          black={false} properties={board.properties.get(false, 'four')}
        />
      </>
    }
    {
      preference.has(PreferenceOption.showPropertyEyes) &&
      <>
        <PropertyEyes
          black={true}
          properties={board.properties.get(true, 'three')}
        />
        <PropertyEyes
          black={true}
          properties={board.properties.get(true, 'four')}
          emphasized
        />
        <PropertyEyes
          black={false}
          properties={board.properties.get(false, 'three')}
        />
        <PropertyEyes
          black={false}
          properties={board.properties.get(false, 'four')}
          emphasized
        />
      </>
    }
    {
      preference.has(PreferenceOption.showForbiddens) &&
      <Forbiddens
        points={board.forbiddens}
      />
    }
  </g>
}

const Forbiddens: FC<{ points: Point[] }> = ({
  points,
}) => {
  const system = useContext(SystemContext)
  const crosses = points.map(
    (p, key) => {
      const [cx, cy] = system.c(p)
      const r = system.C * 2 / 10
      const [x1, x2, y1, y2] = [cx - r, cx + r, cy + r, cy - r]
      return <g key={key} >
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="red"
          strokeWidth={system.forbiddenStrokeWidth}
          opacity="0.5"
        />
        <line
          x1={x1} y1={y2} x2={x2} y2={y1}
          stroke="red"
          strokeWidth={system.forbiddenStrokeWidth}
          opacity="0.5"
        />
      </g>
    }
  )
  return <g>
    { crosses }
  </g>
}

type PropertiesProps = {
  black: boolean
  properties: Property[]
  emphasized?: boolean | undefined
}

const PropertyRows: FC<PropertiesProps> = ({
  black,
  properties,
}) => {
  const system = useContext(SystemContext)
  const lines = properties.map(
    (prop, key) => {
      const [x1, y1] = system.c(prop.start)
      const [x2, y2] = system.c(prop.end)
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
          stroke={black ? 'blue' : 'darkgreen'}
          strokeWidth={system.propertyRowStrokeWidth}
          strokeLinecap="round"
          strokeDasharray={system.propertyRowStrokeDasharray}
          opacity="0.4"
        />
      </g>
    }
  )
  return <g>
    { lines }
  </g>
}

const PropertyEyes: FC<PropertiesProps> = ({
  black,
  properties,
  emphasized,
}) => {
  const system = useContext(SystemContext)
  const gs = properties.map(
    (prop, m) => {
      const rects = prop.eyes.map(
        (e, n) => {
          const [cx, cy] = system.c(e)
          const r = system.C * 2 / 10
          return (
            emphasized
              ? <Diamond
                key={n}
                cx={cx} cy={cy} r={r}
                fill={black ? 'blue' : 'darkgreen'}
              />
              : <circle
                key={n}
                cx={cx} cy={cy} r={r}
                stroke="none"
                fillOpacity="0.4"
                fill={black ? 'blue' : 'darkgreen'}
              />
          )
        }
      )
      return <g key={m}>
        { rects }
      </g>
    }
  )
  return <g>
    { gs }
  </g>
}

const Diamond: FC<{fill: string; cx: number, cy: number, r: number}> = ({
  fill,
  cx,
  cy,
  r,
}) => <g transform={`rotate(45, ${cx}, ${cy})`}>
  <rect
    x={cx - r} y={cy - r}
    width={r * 2} height={r * 2}
    fill={fill}
    stroke="none"
    fillOpacity="0.7"
  />
</g>

export default Default

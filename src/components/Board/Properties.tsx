import React, { FC } from 'react'

import { Board, Point, Property } from '../../rule'

import { N, C } from './coordinate'

type DefaultProps = {
  board: Board
}

const Default: FC<DefaultProps> = ({
  board,
}) => {
  return <g>
    <PropertyRows black={true} properties={board.properties.get(true, 'two')} />
    <PropertyRows black={true} properties={board.properties.get(true, 'closedThree')} />
    <PropertyRows black={true} properties={board.properties.get(true, 'three')} />
    <PropertyRows black={true} properties={board.properties.get(true, 'four')} />
    <PropertyRows black={false} properties={board.properties.get(false, 'two')} />
    <PropertyRows black={false} properties={board.properties.get(false, 'closedThree')} />
    <PropertyRows black={false} properties={board.properties.get(false, 'three')} />
    <PropertyRows black={false} properties={board.properties.get(false, 'four')} />
    <PropertyEyes black={true} properties={board.properties.get(true, 'three')} />
    <PropertyEyes black={true} properties={board.properties.get(true, 'four')} emphasize />
    <PropertyEyes black={false} properties={board.properties.get(false, 'three')} />
    <PropertyEyes black={false} properties={board.properties.get(false, 'four')} emphasize />
    <Forbiddens points={board.forbiddens}/>
  </g>
}

type ForbiddensProps = {
  points: Point[]
}

const Forbiddens: FC<ForbiddensProps> = ({
  points,
}) => {
  const crosses = points.map(
    ([x, y], key) => {
      const [cx, cy] = [x * C, (N - y + 1) * C]
      const [x1, x2, y1, y2] = [
        cx - C * 0.2,
        cx + C * 0.2,
        cy + C * 0.2,
        cy - C * 0.2,
      ]
      return <g key={key} >
        <line
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke="red"
          strokeWidth={4} opacity={0.5}
        />
        <line
          x1={x1} y1={y2}
          x2={x2} y2={y1}
          stroke="red"
          strokeWidth={4} opacity={0.5}
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
  emphasize?: boolean | undefined
}

const PropertyRows: FC<PropertiesProps> = ({
  black,
  properties,
}) => {
  const stroke = black ? 'blue' : 'darkgreen'
  const lines = properties.map(
    (prop, key) => {
      const [p1x, p1y] = prop.start
      const [p2x, p2y] = prop.end
      const [x1, y1] = [p1x * C, (N - p1y + 1) * C]
      const [x2, y2] = [p2x * C, (N - p2y + 1) * C]
      return <g key={key}>
        { (x1 === x2 || y1 === y2) &&
          <line
            x1={x1} y1={y1}
            x2={x2} y2={y2}
            stroke="white"
            strokeLinecap="butt" strokeWidth={4}
            opacity={0.6}
          />
        }
        <line
          x1={x1} y1={y1}
          x2={x2} y2={y2}
          stroke={stroke}
          strokeLinecap="round" strokeWidth={4}
          opacity={0.4} strokeDasharray={'3,5'}
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
  emphasize,
}) => {
  const fill = black ? 'blue' : 'darkgreen'
  const gs = properties.map(
    (prop, m) => {
      const rects = prop.eyes.map(
        ([x, y], n) => {
          const [cx, cy] = [x * C, (N - y + 1) * C]
          return (
            emphasize
              ? <Diamond key={n} cx={cx} cy={cy} fill={fill} r={8} />
              : <circle key={n} cx={cx} cy={cy} r={8} fill={fill} stroke={undefined} fillOpacity={0.4}/>
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

const Diamond: FC<{cx: number, cy: number, r: number, fill: string}> = ({
  cx,
  cy,
  r,
  fill,
}) => <g transform={`rotate(45, ${cx}, ${cy})`}>
  <rect
    x={cx - r} y={cy - r}
    width={r * 2} height={r * 2}
    stroke={undefined}
    fill={fill} fillOpacity={0.7}
  />
</g>

export default Default

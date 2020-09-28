import React, { FC } from 'react'

import { Board, Point, Property } from '../../rule'

import { N, toClassName } from './coordinate'

type DefaultProps = {
  C: number
  board: Board
  showForbiddens: boolean
  showPropertyRows: boolean
  showPropertyEyes: boolean
}

const Default: FC<DefaultProps> = ({
  C,
  board,
  showForbiddens,
  showPropertyRows,
  showPropertyEyes,
}) => {
  return <g>
    {
      showPropertyRows &&
      <>
        <PropertyRows
          C={C}
          black={true}
          properties={board.properties.get(true, 'two')}
        />
        <PropertyRows
          C={C}
          black={true}
          properties={board.properties.get(true, 'closedThree')}
        />
        <PropertyRows
          C={C}
          black={false} properties={board.properties.get(false, 'two')}
        />
        <PropertyRows
          C={C}
          black={false}
          properties={board.properties.get(false, 'closedThree')}
        />
        <PropertyRows
          C={C}
          black={true}
          properties={board.properties.get(true, 'three')}
        />
        <PropertyRows
          C={C}
          black={true}
          properties={board.properties.get(true, 'four')}
        />
        <PropertyRows
          C={C}
          black={false} properties={board.properties.get(false, 'three')}
        />
        <PropertyRows
          C={C}
          black={false} properties={board.properties.get(false, 'four')}
        />
      </>
    }
    {
      showPropertyEyes &&
      <>
        <PropertyEyes
          C={C}
          black={true}
          properties={board.properties.get(true, 'three')}
        />
        <PropertyEyes
          C={C}
          emphasized
          black={true}
          properties={board.properties.get(true, 'four')}
        />
        <PropertyEyes
          C={C}
          black={false}
          properties={board.properties.get(false, 'three')}
        />
        <PropertyEyes
          C={C}
          black={false}
          properties={board.properties.get(false, 'four')}
          emphasized
        />
      </>
    }
    {
      showForbiddens &&
      <Forbiddens
        C={C}
        points={board.forbiddens}
      />
    }
  </g>
}

type ForbiddensProps = {
  C: number
  points: Point[]
}

const Forbiddens: FC<ForbiddensProps> = ({
  C,
  points,
}) => {
  const crosses = points.map(
    ([x, y], key) => {
      const [cx, cy] = [x * C, (N - y + 1) * C]
      const [x1, x2, y1, y2] = [
        cx - C * 2 / 10,
        cx + C * 2 / 10,
        cy + C * 2 / 10,
        cy - C * 2 / 10,
      ]
      return <g key={key} >
        <line
          className="forbidden"
          x1={x1} y1={y1}
          x2={x2} y2={y2}
        />
        <line
          className="forbidden"
          x1={x1} y1={y2}
          x2={x2} y2={y1}
        />
      </g>
    }
  )
  return <g>
    { crosses }
  </g>
}

type PropertiesProps = {
  C: number
  black: boolean
  properties: Property[]
  emphasized?: boolean | undefined
}

const PropertyRows: FC<PropertiesProps> = ({
  C,
  black,
  properties,
}) => {
  const lines = properties.map(
    (prop, key) => {
      const [p1x, p1y] = prop.start
      const [p2x, p2y] = prop.end
      const [x1, y1] = [p1x * C, (N - p1y + 1) * C]
      const [x2, y2] = [p2x * C, (N - p2y + 1) * C]
      return <g key={key}>
        { (x1 === x2 || y1 === y2) &&
          <line
            className="propertyRowUnderlay"
            x1={x1} y1={y1}
            x2={x2} y2={y2}
          />
        }
        <line
          className={`propertyRow ${toClassName(black)}`}
          x1={x1} y1={y1}
          x2={x2} y2={y2}
        />
      </g>
    }
  )
  return <g>
    { lines }
  </g>
}

const PropertyEyes: FC<PropertiesProps> = ({
  C,
  black,
  properties,
  emphasized,
}) => {
  const gs = properties.map(
    (prop, m) => {
      const rects = prop.eyes.map(
        ([x, y], n) => {
          const [cx, cy] = [x * C, (N - y + 1) * C]
          return (
            emphasized
              ? <Diamond
                key={n}
                className={`propertyEye ${toClassName(black)} emphasized`}
                cx={cx} cy={cy} r={C * 2 / 10}
              />
              : <circle
                key={n}
                className={`propertyEye ${toClassName(black)}`}
                cx={cx} cy={cy} r={C * 2 / 10}
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

const Diamond: FC<{className: string; cx: number, cy: number, r: number}> = ({
  className,
  cx,
  cy,
  r,
}) => <g transform={`rotate(45, ${cx}, ${cy})`}>
  <rect
    className={className}
    x={cx - r} y={cy - r}
    width={r * 2} height={r * 2}
  />
</g>

export default Default

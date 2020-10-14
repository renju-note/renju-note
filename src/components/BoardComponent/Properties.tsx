import React, { FC, useContext } from 'react'
import { Board, Point, Property } from '../../rule'
import { SystemContext } from '../system'

type DefaultProps = {
  board: Board
  showForbiddens: boolean
  showPropertyRows: boolean
  showPropertyEyes: boolean
}

const Default: FC<DefaultProps> = ({
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
      showPropertyEyes &&
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
      showForbiddens &&
      <Forbiddens
        points={board.forbiddens}
      />
    }
  </g>
}

type ForbiddensProps = {
  points: Point[]
}

const Forbiddens: FC<ForbiddensProps> = ({
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
          className="forbidden"
          x1={x1} y1={y1} x2={x2} y2={y2}
        />
        <line
          className="forbidden"
          x1={x1} y1={y2} x2={x2} y2={y1}
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
            className="propertyRowUnderlay"
            x1={x1} y1={y1} x2={x2} y2={y2}
          />
        }
        <line
          className={`propertyRow ${system.className(black)}`}
          x1={x1} y1={y1} x2={x2} y2={y2}
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
                className={`propertyEye ${system.className(black)} emphasized`}
                cx={cx} cy={cy} r={r}
              />
              : <circle
                key={n}
                className={`propertyEye ${system.className(black)}`}
                cx={cx} cy={cy} r={r}
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

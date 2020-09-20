import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { State } from '../state'
import { BOARD_SIZE, Point, Board, Property } from '../rule'

const C = 40
const WIDTH = (BOARD_SIZE + 1) * C

const opening: Point[] = [[8, 8], [8, 9], [10, 10]] // D3

const App: FC = () => {
  const [state, setState] = useState<State>(new State({}))
  useEffect(
    () => {
      let s = state
      for (let i = 0; i < opening.length; i++) {
        s = s.move(opening[i])
      }
      setState(s)
    },
    []
  )
  const onClickBoard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [x, y] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(x / C), adjust((WIDTH - y) / C)]
    setState(state.move(p))
  }
  return (
    <div className="App">
      <svg width={WIDTH} height={WIDTH} onClick={onClickBoard}>
        <Ruler cellSize={C} />
        <Stones cellSize={C} points={state.board.blacks} black={true} />
        <Stones cellSize={C} points={state.board.whites} black={false} />
        <Forbiddens cellSize={C} points={state.board.forbiddens} />
        <Properties cellSize={C} properties={state.board.properties.get(true, 'three')} stroke="yellow" />
        <Properties cellSize={C} properties={state.board.properties.get(true, 'four')} stroke="purple" />
        <Properties cellSize={C} properties={state.board.properties.get(true, 'five')} stroke="blue" />
        <Properties cellSize={C} properties={state.board.properties.get(true, 'overline')} stroke="red" />
        <Properties cellSize={C} properties={state.board.properties.get(false, 'five')} stroke="green" />
      </svg>
      <div>
        <span>{state.game.moves.map(toStr).join(' ')}</span>
        <br/>
        <button onClick={() => setState(state.undo())}>undo</button>
        <button onClick={() => setState(state.backward())}>←</button>
        <button onClick={() => setState(state.forward())}>→</button>
      </div>
      <div>
        <RowsTable board={state.board} />
      </div>
    </div>
  )
}

const Stones: FC<{cellSize: number, points: Point[], black: boolean}> = ({
  cellSize,
  points,
  black,
}) => {
  const fill = black ? 'black' : 'white'
  const circles = points.map(
    ([x, y], key) => {
      const [cx, cy] = [x * cellSize, (BOARD_SIZE - y + 1) * cellSize]
      return <circle key={key} cx={cx} cy={cy} r={C / 2 - 2} fill={fill} stroke="black" />
    }
  )
  return <>
    { circles }
  </>
}

const Forbiddens: FC<{cellSize: number, points: Point[]}> = ({
  cellSize,
  points,
}) => {
  const crosses = points.map(
    ([x, y], key) => {
      const [cx, cy] = [x * cellSize, (BOARD_SIZE - y + 1) * cellSize]
      const [x1, x2, y1, y2] = [
        cx - cellSize * 0.3,
        cx + cellSize * 0.3,
        cy + cellSize * 0.3,
        cy - cellSize * 0.3,
      ]
      return <g key={key} >
        <line
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="red"
          strokeWidth={4} opacity={0.5}
        />
        <line
          x1={x1} y1={y2} x2={x2} y2={y1}
          stroke="red"
          strokeWidth={4} opacity={0.5}
        />
      </g>
    }
  )
  return <>
    { crosses }
  </>
}

const Properties: FC<{cellSize: number, properties: Property[], stroke: string}> = ({
  cellSize,
  properties,
  stroke,
}) => {
  const lines = properties.map(
    (prop, key) => {
      const [p1x, p1y] = prop.start
      const [p2x, p2y] = prop.end
      const [x1, y1] = [p1x * cellSize, (BOARD_SIZE - p1y + 1) * cellSize]
      const [x2, y2] = [p2x * cellSize, (BOARD_SIZE - p2y + 1) * cellSize]
      return <line
        key={key}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={stroke} strokeLinecap="round" strokeWidth={4} opacity={0.3} strokeDasharray={'3,5'}
      />
    }
  )
  return <>
    { lines }
  </>
}

const Ruler: FC<{cellSize: number}> = ({
  cellSize
}) => {
  const verticalLines = indices().map((i, key) => {
    const x = i * cellSize
    return <line key={key} x1={x} y1={1 * cellSize} x2={x} y2={BOARD_SIZE * cellSize} stroke="black" />
  })
  const horizontalLines = indices().map((i, key) => {
    const y = (BOARD_SIZE - i + 1) * cellSize
    return <line key={key} x1={1 * cellSize} y1={y} x2={BOARD_SIZE * cellSize} y2={y} stroke="black" />
  })
  return <>
    {verticalLines}
    {horizontalLines}
  </>
}

const RowsTable: FC<{board: Board}> = ({
  board
}) => {
  return <table style={{ marginRight: 'auto', marginLeft: 'auto' }}>
    <thead>
      <tr>
        <th>Black</th>
        <th></th>
        <th>White</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'five')}/>
        </td>
        <th>Five</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'five')}/>
        </td>
      </tr>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'four')}/>
        </td>
        <th>Four</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'four')}/>
        </td>
      </tr>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'three')}/>
        </td>
        <th>Three</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'three')}/>
        </td>
      </tr>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'two')}/>
        </td>
        <th>Two</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'two')}/>
        </td>
      </tr>
    </tbody>
  </table>
}

const PropertyTexts: FC<{ properties: Property[]}> = ({
  properties
}) => {
  return <>
    {
      properties.map(
        (prop, key) => <span key={key}>
          { key !== 0 && <br /> }
          {`${toStr(prop.start)}-${toStr(prop.end)}`}
        </span>
      )
    }
  </>
}

const indices = (): number[] => new Array(BOARD_SIZE).fill(null).map((_, i) => i + 1)

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), BOARD_SIZE)

const VERTICAL_LINE_NAMES = 'ABCDEFGHIJKLMNO'
const toStr = ([x, y]: Point): string => `${VERTICAL_LINE_NAMES.charAt(x - 1)}${y}`

export default App

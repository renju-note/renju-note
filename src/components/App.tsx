import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { State } from '../state'
import { BOARD_SIZE, Board, Point, Segment, Row, ithPoint } from '../rule'

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
        <Forbiddens cellSize={C} points={state.board.forbiddens()} />
        <Rows cellSize={C} rows={state.board.getRows(true, 'three')} stroke="yellow" />
        <Rows cellSize={C} rows={state.board.getRows(true, 'four')} stroke="purple" />
        <Rows cellSize={C} rows={state.board.getRows(true, 'five')} stroke="blue" />
        <Rows cellSize={C} rows={state.board.getRows(true, 'overline')} stroke="red" />
        <Rows cellSize={C} rows={state.board.getRows(false, 'five')} stroke="green" />
      </svg>
      <div>
        <span>{score(state.game.moves)}</span>
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

const Rows: FC<{cellSize: number, rows: [Segment, Row][], stroke: string}> = ({
  cellSize,
  rows,
  stroke,
}) => {
  const lines = rows.map(
    ([seg, row], key) => {
      const [p1x, p1y] = seg.start
      const [p2x, p2y] = ithPoint(seg, row.size - 1)
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
          <SegmentTexts segments={board.getRows(true, 'five').map(([seg, _]) => seg)}/>
        </td>
        <th>Five</th>
        <td>
          <SegmentTexts segments={board.getRows(false, 'five').map(([seg, _]) => seg)}/>
        </td>
      </tr>
      <tr>
        <td>
          <SegmentTexts segments={board.getRows(true, 'four').map(([seg, _]) => seg)}/>
        </td>
        <th>Four</th>
        <td>
          <SegmentTexts segments={board.getRows(false, 'four').map(([seg, _]) => seg)}/>
        </td>
      </tr>
      <tr>
        <td>
          <SegmentTexts segments={board.getRows(true, 'three').map(([seg, _]) => seg)}/>
        </td>
        <th>Three</th>
        <td>
          <SegmentTexts segments={board.getRows(false, 'three').map(([seg, _]) => seg)}/>
        </td>
      </tr>
    </tbody>
  </table>
}

const SegmentTexts: FC<{ segments: Segment[]}> = ({
  segments
}) => {
  return <>
    {
      segments.map(
        (s, key) => <span key={key}>
          { key !== 0 && <br /> }
          {`(${s.start[0]}, ${s.start[1]})-${s.direction}`}
        </span>
      )
    }
  </>
}

const indices = (): number[] => new Array(BOARD_SIZE).fill(null).map((_, i) => i + 1)

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), BOARD_SIZE)

const score = (ps: Point[]): string => {
  const names = 'ABCDEFGHIJKLMNO'
  return ps.map(([x, y]) => `${names.charAt(x - 1)}${y}`).join(' ')
}

export default App

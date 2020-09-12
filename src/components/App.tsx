import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { BOARD_SIZE, Board, Point, Direction, Row, slide } from '../rule'

const C = 40
const WIDTH = (BOARD_SIZE + 1) * C

const App: FC = () => {
  const [turn, setTurn] = useState<boolean>(true)
  const [board, setBoard] = useState<Board>(new Board({ size: BOARD_SIZE }))
  useEffect(
    () => {
      const blacks: Point[] = [
        [1, 1], [2, 1], [4, 1], [5, 1], [6, 1],
        [1, 14], [2, 14], [4, 14], [3, 15], [3, 13], [3, 12],
        [8, 8], [8, 9], [9, 9], [9, 11], [10, 8], [10, 11], [11, 8],
      ]
      const whites: Point[] = [
        [7, 1],
        [8, 10], [9, 13], [11, 11], [12, 8],
      ]
      let b = board
      for (let i = 0; i < blacks.length; i++) {
        b = b.put(blacks[i], true)
      }
      for (let i = 0; i < whites.length; i++) {
        b = b.put(whites[i], false)
      }
      setBoard(b)
    },
    []
  )
  const onClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [x, y] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(x / C), adjust((WIDTH - y) / C)]
    const newBoard = board.put(p, turn)
    setBoard(newBoard)
    setTurn(!turn)
  }
  return (
    <div className="App">
      <svg width={WIDTH} height={WIDTH} onClick={onClick}>
        <Ruler cellSize={C} />
        <Stones cellSize={C} points={board.blacks} black={true} />
        <Stones cellSize={C} points={board.whites} black={false} />
        <Forbiddens cellSize={C} points={board.forbiddens()} />
        <Rows cellSize={C} rows={board.blackRows.get('three') ?? []} stroke="yellow" />
        <Rows cellSize={C} rows={board.blackRows.get('four') ?? []} stroke="purple" />
        <Rows cellSize={C} rows={board.blackRows.get('five') ?? []} stroke="blue" />
        <Rows cellSize={C} rows={board.blackRows.get('overline') ?? []} stroke="red" />
        <Rows cellSize={C} rows={board.whiteRows.get('five') ?? []} stroke="green" />
      </svg>
      <div>
        <RowsTable board={board} />
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

const Rows: FC<{cellSize: number, rows: [[Point, Direction], Row][], stroke: string}> = ({
  cellSize,
  rows,
  stroke,
}) => {
  const lines = rows.map(
    ([[point, direction], row], key) => {
      const [p1x, p1y] = point
      const [p2x, p2y] = slide(point, direction, row.size - 1)
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
        <th></th>
        <th>Black</th>
        <th>White</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <th>Won</th>
        <td>{board.blackWon().toString()}</td>
        <td>{board.whiteWon().toString()}</td>
      </tr>
      <tr>
        <th>Five</th>
        <td>{(board.blackRows.get('five') ?? []).map(([[a, b], _]) => `(${a})-(${b})`).join('\n')}</td>
        <td>{(board.whiteRows.get('five') ?? []).map(([[a, b], _]) => `(${a})-(${b})`).join('\n')}</td>
      </tr>
      <tr>
        <th>Four</th>
        <td>{(board.blackRows.get('four') ?? []).map(([[a, b], _]) => `(${a})-(${b})`).join('\n')}</td>
        <td>{(board.whiteRows.get('four') ?? []).map(([[a, b], _]) => `(${a})-(${b})`).join('\n')}</td>
      </tr>
      <tr>
        <th>Three</th>
        <td>{(board.blackRows.get('three') ?? []).map(([[a, b], _]) => `(${a})-(${b})`).join('\n')}</td>
        <td>{(board.whiteRows.get('three') ?? []).map(([[a, b], _]) => `(${a})-(${b})`).join('\n')}</td>
      </tr>
    </tbody>
  </table>
}

const indices = (): number[] => new Array(BOARD_SIZE).fill(null).map((_, i) => i + 1)

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), BOARD_SIZE)

export default App

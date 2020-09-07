import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { BOARD_SIZE, Board, Point } from '../rule'

const C = 40
const WIDTH = (BOARD_SIZE + 1) * C

const App: FC = () => {
  const [board, setBoard] = useState<Board>(new Board({ size: BOARD_SIZE }))
  useEffect(
    () => {
      const example: Point[] = [[8, 8], [8, 9], [10, 10]]
      let b = board
      for (let i = 0; i < example.length; i++) {
        b = b.move(example[i])
      }
      setBoard(b)
    },
    []
  )
  const onClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [x, y] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(x / C), adjust((WIDTH - y) / C)]
    const newBoard = board.move(p)
    setBoard(newBoard)
    newBoard.stripes.forEach(s => console.log(s.toString()))
  }
  return (
    <div className="App">
      <svg width={WIDTH} height={WIDTH} onClick={onClick}>
        <Ruler cellSize={C} />
        <Moves cellSize={C} moves={board.moves} />
        <Rows cellSize={C} rows={(board.blackRows.get('three') ?? []).map(([ps, _]) => ps)} stroke="blue" />
        <Rows cellSize={C} rows={(board.whiteRows.get('three') ?? []).map(([ps, _]) => ps)} stroke="green" />
        <Rows cellSize={C} rows={(board.blackRows.get('four') ?? []).map(([ps, _]) => ps)} stroke="blue" />
        <Rows cellSize={C} rows={(board.whiteRows.get('four') ?? []).map(([ps, _]) => ps)} stroke="green" />
        <Rows cellSize={C} rows={(board.blackRows.get('five') ?? []).map(([ps, _]) => ps)} stroke="blue" />
        <Rows cellSize={C} rows={(board.whiteRows.get('five') ?? []).map(([ps, _]) => ps)} stroke="green" />
      </svg>
      <div>
        <RowsTable board={board} />
      </div>
    </div>
  )
}

const Moves: FC<{cellSize: number, moves: Point[]}> = ({
  cellSize,
  moves,
}) => {
  const circles = moves.map(
    ([x, y], n) => {
      const fill = n % 2 === 0 ? 'black' : 'white'
      const [cx, cy] = [x * cellSize, (BOARD_SIZE - y + 1) * cellSize]
      return <circle key={n} cx={cx} cy={cy} r={C / 2 - 2} fill={fill} stroke="black" />
    }
  )
  return <>
    { circles }
  </>
}

const Rows: FC<{cellSize: number, rows: [Point, Point][], stroke: string}> = ({
  cellSize,
  rows,
  stroke,
}) => {
  const lines = rows.map(
    ([[p1x, p1y], [p2x, p2y]], key) => {
      const [x1, y1] = [p1x * cellSize, (BOARD_SIZE - p1y + 1) * cellSize]
      const [x2, y2] = [p2x * cellSize, (BOARD_SIZE - p2y + 1) * cellSize]
      return <line
        key={key}
        x1={x1} y1={y1} x2={x2} y2={y2}
        stroke={stroke} strokeLinecap="round" strokeWidth={4} opacity={0.2} strokeDasharray={'3,5'}
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

import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { Board, Point, Index, N_INDICES, indices } from '../rule'

const C = 40
const boardSize = (N_INDICES + 1) * C

const App: FC = () => {
  const [board, setBoard] = useState<Board>(new Board())
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
    const p: Point = [adjust(x / C), adjust((boardSize - y) / C)]
    const newBoard = board.move(p)
    setBoard(newBoard)
    console.log(newBoard.stripes.vertical.toString())
    console.log(newBoard.stripes.horizontal.toString())
    console.log(newBoard.stripes.ascending.toString())
    console.log(newBoard.stripes.descending.toString())
  }
  return (
    <div className="App">
      <svg width={boardSize} height={boardSize} onClick={onClick}>
        <Ruler cellSize={C} />
        <Moves cellSize={C} moves={board.moves} />
        <Rows cellSize={C} rows={board.blackProps.three} stroke="blue" />
        <Rows cellSize={C} rows={board.whiteProps.three} stroke="green" />
        <Rows cellSize={C} rows={board.blackProps.four} stroke="blue" />
        <Rows cellSize={C} rows={board.whiteProps.four} stroke="green" />
        <Rows cellSize={C} rows={board.blackProps.five} stroke="blue" />
        <Rows cellSize={C} rows={board.whiteProps.five} stroke="green" />
      </svg>
      <div>
        <PropsTable board={board} />
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
      const [cx, cy] = [x * cellSize, (N_INDICES - y + 1) * cellSize]
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
      const [x1, y1] = [p1x * cellSize, (N_INDICES - p1y + 1) * cellSize]
      const [x2, y2] = [p2x * cellSize, (N_INDICES - p2y + 1) * cellSize]
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
  const verticalLines = indices.map((i, k) => {
    const x = i * cellSize
    return <line key={k} x1={x} y1={1 * cellSize} x2={x} y2={N_INDICES * cellSize} stroke="black" />
  })
  const horizontalLines = indices.map((i, k) => {
    const y = (N_INDICES - i + 1) * cellSize
    return <line key={k} x1={1 * cellSize} y1={y} x2={N_INDICES * cellSize} y2={y} stroke="black" />
  })
  return <>
    {verticalLines}
    {horizontalLines}
  </>
}

const PropsTable: FC<{board: Board}> = ({
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
        <td>{board.blackProps.five.map(([a, b]) => `(${a})-(${b})`).join('\n')}</td>
        <td>{board.whiteProps.five.map(([a, b]) => `(${a})-(${b})`).join('\n')}</td>
      </tr>
      <tr>
        <th>Four</th>
        <td>{board.blackProps.four.map(([a, b]) => `(${a})-(${b})`).join('\n')}</td>
        <td>{board.whiteProps.four.map(([a, b]) => `(${a})-(${b})`).join('\n')}</td>
      </tr>
      <tr>
        <th>Three</th>
        <td>{board.blackProps.three.map(([a, b]) => `(${a})-(${b})`).join('\n')}</td>
        <td>{board.whiteProps.three.map(([a, b]) => `(${a})-(${b})`).join('\n')}</td>
      </tr>
    </tbody>
  </table>
}

const adjust = (n: number): Index => {
  const r = Math.round(n)
  if (r < 1) {
    return 1
  } else if (r > 15) {
    return 15
  } else {
    return r as Index
  }
}

export default App

import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { Board, Point, Index, N_INDICES, indices } from '../rule'

const C = 50
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
        {
          // vertical lines, left to right
          indices.map(
            (i, k) => {
              const x = i * C
              return <line key={k} x1={x} y1={1 * C} x2={x} y2={N_INDICES * C} stroke="black" />
            }
          )
        }
        {
          // horizontal lines, bottom to top
          indices.map(
            (j, k) => {
              const y = (N_INDICES - j + 1) * C
              return <line key={k} x1={1 * C} y1={y} x2={N_INDICES * C} y2={y} stroke="black" />
            }
          )
        }
        { board.moves.map(
          ([x, y], n) => {
            const fill = n % 2 === 0 ? 'black' : 'white'
            const [cx, cy] = [x * C, (N_INDICES - y + 1) * C]
            return <circle key={n} cx={cx} cy={cy} r={C / 2 - 2} fill={fill} stroke="black" />
          }
        )
        }
      </svg>
      <div>
        blackWon: {board.blackWon().toString()} <br/>
        whiteWon: {board.whiteWon().toString()}
      </div>
    </div>
  )
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

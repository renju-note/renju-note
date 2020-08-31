import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { Point, Index, indices, N_INDICES } from '../rule'

const C = 50
const boardSize = (N_INDICES + 1) * C

const App: FC = () => {
  const [moves, setMoves] = useState<Point[]>([])
  useEffect(
    () => {
      setMoves([[8, 8], [8, 9], [10, 10]]) // D3
    },
    []
  )
  const onClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [x, y] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(x / C), adjust((boardSize - y) / C)]
    setMoves((prev) => [...prev, p])
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
        { moves.map(
          ([i, j], n) => {
            const fill = n % 2 === 0 ? 'black' : 'white'
            const [cx, cy] = [i * C, (N_INDICES - j + 1) * C]
            return <circle key={n} cx={cx} cy={cy} r={C / 2 - 1} fill={fill} stroke="black" />
          }
        )
        }
      </svg>
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

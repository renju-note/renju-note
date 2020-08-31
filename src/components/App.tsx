import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { Point, Line, lines } from '../rule'

const C = 50

const App: FC = () => {
  const [moves, setMoves] = useState<Point[]>([])
  useEffect(
    () => {
      setMoves([[8, 8], [8, 7], [10, 6]]) // D3
    },
    []
  )
  const onClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [rawX, rawY] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjustLine(rawX / C), adjustLine(rawY / C)]
    setMoves((prev) => [...prev, p])
  }
  return (
    <div className="App">
      <svg width={16 * C} height={16 * C} onClick={onClick}>
        { lines.map(
          (x, i) => <line key={i} x1={x * C} y1={1 * C} x2={x * C} y2={15 * C} stroke="black" />
        )
        }
        { lines.map(
          (y, j) => <line key={j} x1={1 * C} y1={y * C} x2={15 * C} y2={y * C} stroke="black" />
        )
        }
        { moves.map(
          ([x, y], n) => {
            const fill = n % 2 === 0 ? 'black' : 'white'
            return <circle key={n} cx={x * C} cy={y * C} r={C / 2 - 1} fill={fill} stroke="black" />
          }
        )
        }
      </svg>
    </div>
  )
}

const adjustLine = (n: number): Line => {
  const r = Math.round(n)
  if (r < 1) {
    return 1
  } else if (r > 15) {
    return 15
  } else {
    return r as Line
  }
}

export default App

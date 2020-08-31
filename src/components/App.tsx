import React, { FC, useState, useEffect } from 'react'
import './App.css'

const C = 50

const App: FC = () => {
  const points = new Array(15).fill(null).map((_, i) => i + 1)
  console.log(points)
  const [stones, setStones] = useState<[number, number][]>([])
  useEffect(
    () => {
      setStones([[8, 8], [8, 7], [10, 6]]) // D3
    },
    []
  )
  const onClick = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [x, y] = [e.clientX - base.x, e.clientY - base.y]
    setStones((prev) => [...prev, [Math.round(x / C), Math.round(y / C)]])
  }
  return (
    <div className="App">
      <svg width={16 * C} height={16 * C} onClick={onClick}>
        { points.map(
          (x, i) => <line key={i} x1={x * C} y1={1 * C} x2={x * C} y2={15 * C} stroke="black" />
        )
        }
        { points.map(
          (y, j) => <line key={j} x1={1 * C} y1={y * C} x2={15 * C} y2={y * C} stroke="black" />
        )
        }
        { stones.map(
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

export default App

import React, { FC, useState, useEffect } from 'react'
import './App.css'

const App: FC = () => {
  const points = [50, 100, 150, 200, 250, 300, 350, 400, 450, 500, 550, 600, 650, 700, 750]
  const [stones, setStones] = useState<[number, number][]>([])
  useEffect(
    () => {
      setStones([[8, 8], [8, 7], [10, 6]])
    },
    []
  )
  return (
    <div className="App">
      <svg width="800px" height="800px">
        { points.map(
          (x, i) => <line key={i} x1={x} y1="50" x2={x} y2="750" stroke="black" />
        )
        }
        { points.map(
          (y, j) => <line key={j} x1="50" y1={y} x2="750" y2={y} stroke="black" />
        )
        }
        { stones.map(
          ([x, y], n) => {
            const fill = n % 2 === 0 ? 'black' : 'white'
            return <circle key={n} cx={x * 50} cy={y * 50} r={24} fill={fill} stroke="black" />
          }
        )
        }
      </svg>
    </div>
  )
}

export default App

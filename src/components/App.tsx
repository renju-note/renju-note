import React, { FC, useState, useEffect } from 'react'
import './App.css'

import { BOARD_SIZE, Board, Point, Segment, Row, ith } from '../rule'

const C = 40
const WIDTH = (BOARD_SIZE + 1) * C

const App: FC = () => {
  const [turn, setTurn] = useState<boolean>(true)
  const [board, setBoard] = useState<Board>(new Board({ size: BOARD_SIZE }))
  useEffect(
    () => {
      const blacks: Point[] = [
        [2, 13], [3, 12], [3, 14], [4, 13], // dowble three
        [2, 7], [3, 6], [3, 8], [4, 7], // fake dowble three
        [12, 11], [12, 12], [13, 12], [13, 14], [14, 11], [14, 14], [15, 11], // dowble three
        [11, 7], [12, 6], [12, 5], [14, 4], [14, 5], [15, 5], // dowble four
        [1, 2], [2, 2], [4, 2], [7, 2], [8, 2], // dowble four
        [1, 1], [3, 1], [5, 1], [7, 1], // dowble four
        [10, 1], [11, 1], [13, 1], [14, 1], [15, 1], // overline
      ]
      const whites: Point[] = [
        [6, 7],
        [8, 1],
        [12, 13],
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

const Rows: FC<{cellSize: number, rows: [Segment, Row][], stroke: string}> = ({
  cellSize,
  rows,
  stroke,
}) => {
  const lines = rows.map(
    ([seg, row], key) => {
      const [p1x, p1y] = seg.start
      const [p2x, p2y] = ith(seg, row.size - 1)
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
        <td>
          <SegmentTexts segments={(board.blackRows.get('five') ?? []).map(([seg, _]) => seg)}/>
        </td>
        <td>
          <SegmentTexts segments={(board.whiteRows.get('five') ?? []).map(([seg, _]) => seg)}/>
        </td>
      </tr>
      <tr>
        <th>Four</th>
        <td>
          <SegmentTexts segments={(board.blackRows.get('four') ?? []).map(([seg, _]) => seg)}/>
        </td>
        <td>
          <SegmentTexts segments={(board.whiteRows.get('four') ?? []).map(([seg, _]) => seg)}/>
        </td>
      </tr>
      <tr>
        <th>Three</th>
        <td>
          <SegmentTexts segments={(board.blackRows.get('three') ?? []).map(([seg, _]) => seg)}/>
        </td>
        <td>
          <SegmentTexts segments={(board.whiteRows.get('three') ?? []).map(([seg, _]) => seg)}/>
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

export default App

import React, { FC, useState } from 'react'
import './App.css'

import { BOARD_SIZE, Point, Board, Property } from '../rule'
import { State } from '../state'

import Base from './Base'
import Stones from './Stones'
import Properties from './Properties'

const C = 40
const WIDTH = (BOARD_SIZE + 1) * C

const App: FC = () => {
  const [state, setState] = useState<State>(new State({}))
  const onClickBoard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [x, y] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(x / C), adjust((WIDTH - y) / C)]
    setState(state.move(p))
  }
  return (
    <div className="App">
      <svg width={WIDTH} height={WIDTH} onClick={onClickBoard}>
        <Base showIndices={true} />
        <Properties board={state.board} />
        <Stones moves={state.game.moves} showOrders={true} emphasizeLast={true} />
      </svg>
      <div>
        <span>{state.game.moves.map(toStr).join(' ')}</span>
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
          <PropertyTexts properties={board.properties.get(true, 'five')}/>
        </td>
        <th>Five</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'five')}/>
        </td>
      </tr>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'four')}/>
        </td>
        <th>Four</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'four')}/>
        </td>
      </tr>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'three')}/>
        </td>
        <th>Three</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'three')}/>
        </td>
      </tr>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'closedThree')}/>
        </td>
        <th>Closed Three</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'closedThree')}/>
        </td>
      </tr>
      <tr>
        <td>
          <PropertyTexts properties={board.properties.get(true, 'two')}/>
        </td>
        <th>Two</th>
        <td>
          <PropertyTexts properties={board.properties.get(false, 'two')}/>
        </td>
      </tr>
    </tbody>
  </table>
}

const PropertyTexts: FC<{ properties: Property[]}> = ({
  properties
}) => {
  return <>
    {
      properties.map(
        (prop, key) => <span key={key}>
          { key !== 0 && <br /> }
          {`${toStr(prop.start)}-${toStr(prop.end)}`}
        </span>
      )
    }
  </>
}

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), BOARD_SIZE)

const VERTICAL_LINE_NAMES = 'ABCDEFGHIJKLMNO'
const toStr = ([x, y]: Point): string => `${VERTICAL_LINE_NAMES.charAt(x - 1)}${y}`

export default App

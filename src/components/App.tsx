import React, { FC, useState } from 'react'
import './App.css'

import { State } from '../state'
import { code } from './code'
import Board from './Board'

const App: FC = () => {
  const [state, setState] = useState<State>(new State({}))
  return (
    <div className="App">
      <Board state={state} setState={setState} />
      <div>
        <span>{state.game.moves.map(code).join(' ')}</span>
        <br/>
        <button onClick={() => setState(state.undo())}>undo</button>
        <button onClick={() => setState(state.backward())}>←</button>
        <button onClick={() => setState(state.forward())}>→</button>
      </div>
    </div>
  )
}

export default App

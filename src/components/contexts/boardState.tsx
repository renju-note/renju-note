import { createContext, FC, useState } from 'react'
import { BoardState, GameState } from '../../state'

export type BoardStateContext = {
  boardState: BoardState
  gameState: GameState
  setBoardState: (s: BoardState) => void
  setGameState: (s: GameState) => void
}

export const BoardStateContext = createContext<BoardStateContext>({
  boardState: new BoardState(),
  gameState: new GameState(),
  setBoardState: () => {},
  setGameState: () => {},
})

export const BoardStateProvider: FC = ({ children }) => {
  const [boardState, setBoardStateState] = useState<BoardState>(
    () => BoardState.decode(window.location.hash.slice(1)) || new BoardState()
  )
  const setBoardState = (s: BoardState) => {
    setBoardStateState(s)
    window.history.replaceState(null, '', `#${s.encode()}`)
  }
  const setGameState = (s: GameState) => {
    setBoardState(boardState.setMainGame(s))
  }
  return (
    <BoardStateContext.Provider
      value={{ boardState, gameState: boardState.mainGame, setBoardState, setGameState }}
    >
      {children}
    </BoardStateContext.Provider>
  )
}

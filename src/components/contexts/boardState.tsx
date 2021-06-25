import { createContext, FC, useState } from 'react'
import { BoardState, ConfirmState, GameState } from '../../state'

export type BoardStateContext = {
  boardState: BoardState
  gameState: GameState
  confirmState?: ConfirmState
  setBoardState: (s: BoardState) => void
  setGameState: (s: GameState) => void
  setConfirmState: (s?: ConfirmState) => void
}

export const BoardStateContext = createContext<BoardStateContext>({
  boardState: new BoardState(),
  gameState: new GameState(),
  confirmState: undefined,
  setBoardState: () => {},
  setGameState: () => {},
  setConfirmState: () => {},
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
  const [confirmState, setConfirmState] = useState<ConfirmState>()
  return (
    <BoardStateContext.Provider
      value={{
        boardState,
        gameState: boardState.mainGame,
        confirmState,
        setBoardState,
        setGameState,
        setConfirmState,
      }}
    >
      {children}
    </BoardStateContext.Provider>
  )
}

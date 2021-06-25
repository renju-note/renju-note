import { createContext, FC, useState } from 'react'
import { BoardState, ConfirmationState, GameState } from '../../state'

export type BoardStateContext = {
  boardState: BoardState
  gameState: GameState
  confirmationState?: ConfirmationState
  setBoardState: (s: BoardState) => void
  setGameState: (s: GameState) => void
  setConfirmationState: (s?: ConfirmationState) => void
}

export const BoardStateContext = createContext<BoardStateContext>({
  boardState: new BoardState(),
  gameState: new GameState(),
  confirmationState: undefined,
  setBoardState: () => {},
  setGameState: () => {},
  setConfirmationState: () => {},
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
  const [confirmationState, setConfirmationState] = useState<ConfirmationState>()
  return (
    <BoardStateContext.Provider
      value={{
        boardState,
        gameState: boardState.mainGame,
        confirmationState,
        setBoardState,
        setGameState,
        setConfirmationState,
      }}
    >
      {children}
    </BoardStateContext.Provider>
  )
}

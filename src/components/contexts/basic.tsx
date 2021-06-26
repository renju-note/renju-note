import { createContext, FC, useState } from 'react'
import { BoardState, ConfirmState, GameState } from '../../state'

export type BasicContext = {
  boardState: BoardState
  setBoardState: (s: BoardState) => void
  gameState: GameState
  setGameState: (s: GameState) => void
  confirmState?: ConfirmState
  setConfirmState: (s?: ConfirmState) => void
}

export const BasicContext = createContext<BasicContext>({
  boardState: new BoardState(),
  setBoardState: () => {},
  gameState: new GameState(),
  setGameState: () => {},
  confirmState: undefined,
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
  // proxy
  const setGameState = (s: GameState) => {
    setBoardState(boardState.setMainGame(s))
  }
  const [confirmState, setConfirmState] = useState<ConfirmState>()
  return (
    <BasicContext.Provider
      value={{
        boardState,
        setBoardState,
        gameState: boardState.mainGame,
        setGameState,
        confirmState,
        setConfirmState,
      }}
    >
      {children}
    </BasicContext.Provider>
  )
}

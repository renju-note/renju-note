import { createContext, FC, useState } from 'react'
import { BoardState, ConfirmState } from '../../state'

export type BasicContext = {
  boardState: BoardState
  setBoardState: (s: BoardState) => void
  confirmState?: ConfirmState
  setConfirmState: (s?: ConfirmState) => void
}

export const BasicContext = createContext<BasicContext>({
  boardState: new BoardState(),
  setBoardState: () => {},
  confirmState: undefined,
  setConfirmState: () => {},
})

export const BasicContextProvider: FC = ({ children }) => {
  const [boardState, setBoardStateState] = useState<BoardState>(
    () => BoardState.decode(window.location.hash.slice(1)) || new BoardState()
  )
  const setBoardState = (s: BoardState) => {
    setBoardStateState(s)
    window.history.replaceState(null, '', `#${s.encode()}`)
  }
  const [confirmState, setConfirmState] = useState<ConfirmState>()
  return (
    <BasicContext.Provider
      value={{
        boardState,
        setBoardState,
        confirmState,
        setConfirmState,
      }}
    >
      {children}
    </BasicContext.Provider>
  )
}

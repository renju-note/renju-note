import { createContext, useState } from 'react'
import { BoardState } from '../../state'

export type BoardStateContext = {
  boardState: BoardState
  setBoardState: (s: BoardState) => void
}

export const BoardStateContext = createContext<BoardStateContext>({
  boardState: new BoardState(),
  setBoardState: () => {},
})

export const useBoardState = (): BoardStateContext => {
  const [boardState, setBoardStateState] = useState<BoardState>(
    () => BoardState.decode(window.location.hash.slice(1)) || new BoardState()
  )
  const setBoardState = (s: BoardState) => {
    setBoardStateState(s)
    window.history.replaceState(null, '', `#${s.encode()}`)
  }
  return { boardState, setBoardState }
}

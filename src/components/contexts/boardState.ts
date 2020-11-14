import { createContext, useState } from 'react'
import { BoardState } from '../../state'

export type SetBoardState = (s: BoardState) => void

export const useBoardState = (): [BoardState, SetBoardState] => {
  const init = BoardState.decode(window.location.hash.slice(1)) || new BoardState({})
  const [boardState, setBoardState] = useState<BoardState>(init)

  const setBoardStateAndHash = (s: BoardState) => {
    setBoardState(s)
    window.history.replaceState(null, '', `#${s.encode()}`)
  }
  return [boardState, setBoardStateAndHash]
}

export const BoardStateContext = createContext<[BoardState, SetBoardState]>([new BoardState({}), () => {}])

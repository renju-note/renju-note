import React, { createContext, FC, useState } from 'react'
import { GameView } from '../../../../database'

export type GameViewContext = {
  gameView: GameView | undefined
  setGameView: (s: GameView) => void
}

export const GameViewContext = createContext<GameViewContext>({
  gameView: undefined,
  setGameView: () => {},
})

export const GameViewProvider: FC = ({ children }) => {
  const [gameView, setGameView] = useState<GameView>()
  return (
    <GameViewContext.Provider value={{ gameView, setGameView }}>
      {children}
    </GameViewContext.Provider>
  )
}

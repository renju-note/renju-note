import React, { FC, useContext } from 'react'
import { BoardOption, EditMode } from '../../state'
import { BoardStateContext, PreferenceContext, PreferenceOption } from '../contexts'
import { LastMove, Moves, Orders } from './common'

const Default: FC = () => {
  const { preference } = useContext(PreferenceContext)
  const { boardState, gameState } = useContext(BoardStateContext)
  const game = boardState.mode === EditMode.preview ? gameState.main : gameState.current
  return (
    <g>
      {preference.has(PreferenceOption.emphasizeLastMove) && game.lastMove && (
        <LastMove point={game.lastMove} />
      )}
      <Moves moves={game.moves} invert={boardState.options.has(BoardOption.invertMoves)} />
      {preference.has(PreferenceOption.showOrders) && (
        <Orders moves={game.moves} invert={boardState.options.has(BoardOption.invertMoves)} />
      )}
    </g>
  )
}

export default Default

import React, { FC, useContext } from 'react'
import { BoardOption } from '../../state'
import { BoardStateContext, PreferenceContext, PreferenceOption } from '../contexts'
import { LastMove, Moves, Orders } from './common'

const Default: FC = () => {
  const { preference } = useContext(PreferenceContext)
  const { boardState, gameState } = useContext(BoardStateContext)
  const current = gameState.current
  return (
    <g>
      {preference.has(PreferenceOption.emphasizeLastMove) && current.lastMove && (
        <LastMove point={current.lastMove} />
      )}
      <Moves moves={current.moves} invert={boardState.options.has(BoardOption.invertMoves)} />
      {preference.has(PreferenceOption.showOrders) && (
        <Orders moves={current.moves} invert={boardState.options.has(BoardOption.invertMoves)} />
      )}
    </g>
  )
}

export default Default

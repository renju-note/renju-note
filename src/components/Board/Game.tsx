import React, { FC, useContext } from 'react'
import { BoardOption } from '../../state'
import { BoardStateContext, PreferenceContext, PreferenceOption } from '../contexts'
import { LastMove, Moves, Orders } from './common'

const Default: FC = () => {
  const { preference } = useContext(PreferenceContext)
  const { boardState } = useContext(BoardStateContext)
  return <g>
    {
      preference.has(PreferenceOption.emphasizeLastMove) && boardState.lastMove &&
      <LastMove
        point={boardState.lastMove}
      />
    }
    <Moves
      moves={boardState.moves}
      invert={boardState.options.has(BoardOption.invertMoves)}
    />
    {
      preference.has(PreferenceOption.showOrders) &&
      <Orders
        moves={boardState.moves}
        invert={boardState.options.has(BoardOption.invertMoves)}
      />
    }
  </g>
}

export default Default

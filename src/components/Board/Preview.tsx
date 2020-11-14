import React, { FC, useContext } from 'react'
import { BoardStateContext, SystemContext } from '../contexts'
import { LastMove, Moves, Orders } from './common'

const Default: FC = () => {
  const { boardState } = useContext(BoardStateContext)
  if (boardState.previewingGame === undefined) return <></>
  const game = boardState.previewingGame
  return (
    <g>
      <Overlay />
      {game.lastMove && <LastMove point={game.lastMove} />}
      <Moves moves={game.moves} />
      <Orders moves={game.moves} />
    </g>
  )
}

const Overlay: FC = () => {
  const system = useContext(SystemContext)
  return (
    <rect
      x={0}
      y={0}
      width={system.W}
      height={system.W}
      rx={system.C / 4}
      ry={system.C / 4}
      fill="lavender"
      opacity={0.7}
    />
  )
}

export default Default

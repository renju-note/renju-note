import React, { FC, useContext } from 'react'
import { Point } from '../../../rule'
import { BoardOption, BoardState, EditMode, GameState } from '../../../state'
import { PreferenceContext, PreferenceOption, SystemContext } from '../../contexts'
import Base from './Base'
import Markers from './Markers'
import Properties from './Properties'
import Stones from './Stones'

type Props = {
  id: string
  boardState: BoardState
  gameState: GameState
  onClickPoint?: ([x, y]: Point) => void
}

const Default: FC<Props> = ({ id, onClickPoint, boardState, gameState }) => {
  const system = useContext(SystemContext)
  const { preference } = useContext(PreferenceContext)
  const game = boardState.mode === EditMode.preview ? gameState.main : gameState.current
  const onClick =
    onClickPoint &&
    ((e: React.MouseEvent<SVGElement, MouseEvent>) => {
      const base = e.currentTarget.getBoundingClientRect()
      const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
      onClickPoint(system.p([bx, by]))
    })
  return (
    <svg id={id} width={system.W} height={system.W} onClick={onClick}>
      <Base
        showIndices={preference.has(PreferenceOption.showIndices)}
        showOverlay={boardState.mode === EditMode.preview}
      />
      <Properties
        board={boardState.current}
        showRows={preference.has(PreferenceOption.showPropertyRows)}
        showEyes={preference.has(PreferenceOption.showPropertyEyes)}
        showForbiddens={preference.has(PreferenceOption.showForbiddens)}
      />
      <Markers
        points={boardState.markerPoints}
        segments={boardState.markerLines}
        sequence={boardState.numberedPoints}
        showPointsLabel={boardState.options.has(BoardOption.labelMarkers)}
      />
      <Stones
        game={game}
        invert={boardState.options.has(BoardOption.invertMoves)}
        showOrders={preference.has(PreferenceOption.showOrders)}
        showLastMove={preference.has(PreferenceOption.emphasizeLastMove)}
        freeBlacks={boardState.freeBlacks}
        freeWhites={boardState.freeWhites}
      />
    </svg>
  )
}

export default Default

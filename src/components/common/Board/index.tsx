import React, { FC, useContext } from 'react'
import { Point } from 'renjukit'
import { BoardMode, BoardState } from '../../../state'
import { PreferenceContext, PreferenceOption, SystemContext } from '../../contexts'
import Base from './Base'
import Markers from './Markers'
import Properties from './Properties'
import Stones from './Stones'

type Props = {
  id: string
  state: BoardState
  onClickPoint?: ([x, y]: Point) => void
}

const Default: FC<Props> = ({ id, onClickPoint, state }) => {
  const system = useContext(SystemContext)
  const { preference } = useContext(PreferenceContext)
  const game = state.mode === BoardMode.preview ? state.game.main : state.game.current
  const onClick =
    onClickPoint &&
    ((e: React.MouseEvent<SVGElement, MouseEvent>) => {
      const base = e.currentTarget.getBoundingClientRect()
      const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
      onClickPoint(system.p([bx, by]))
    })
  const isPreview = state.mode === BoardMode.preview
  return (
    <svg id={id} width={system.W} height={system.W} onClick={onClick}>
      <Base
        showIndices={preference.has(PreferenceOption.showIndices)}
        showOverlay={isPreview}
        colorBase={preference.has(PreferenceOption.colorBase)}
      />
      {!isPreview && (
        <Properties
          board={state.current}
          showRows={preference.has(PreferenceOption.showPropertyRows)}
          showEyes={preference.has(PreferenceOption.showPropertyEyes)}
          showForbiddens={preference.has(PreferenceOption.showForbiddens)}
        />
      )}
      {!isPreview && (
        <Markers
          points={state.markerPoints}
          segments={state.markerLines}
          sequence={state.numberedPoints}
          showPointsLabel={preference.has(PreferenceOption.showOrders)}
        />
      )}
      <Stones
        game={game}
        showOrders={preference.has(PreferenceOption.showOrders)}
        showLastMove={preference.has(PreferenceOption.emphasizeLastMove)}
        freeBlacks={state.freeBlacks}
        freeWhites={state.freeWhites}
      />
    </svg>
  )
}

export default Default

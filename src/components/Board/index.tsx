import * as React from 'react'
import { FC, useContext } from 'react'
import { Point } from '../../rule'
import { EditMode } from '../../state'
import { BoardStateContext, PreferenceContext, PreferenceOption, SystemContext } from '../contexts'
import Base from './Base'
import FreeStones from './FreeStones'
import Game from './Game'
import Markers from './Markers'
import Properties from './Properties'

type DefaultProps = {
  id: string
  onClickPoint?: ([x, y]: Point) => void
}

const Default: FC<DefaultProps> = ({ id, onClickPoint }) => {
  const system = useContext(SystemContext)
  const { boardState } = useContext(BoardStateContext)
  const { preference } = useContext(PreferenceContext)
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
      <Markers />
      <FreeStones />
      <Game />
    </svg>
  )
}

export default Default

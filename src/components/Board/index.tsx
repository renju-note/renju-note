import React, { FC } from 'react'

import { Point, N_LINES } from '../../rule'
import { State } from '../../state'
import Base from './Base'
import Stones from './Stones'
import Properties from './Properties'
import { Preference } from '../preference'

type DefaultProps = {
  width: number
  state: State
  setState: (s: State) => void
  preference: Preference
}

const Default: FC<DefaultProps> = ({
  width,
  state,
  setState,
  preference,
}) => {
  const [W, C] = width >= 640 ? [640, 40] : [320, 20]
  const onClickBoard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(bx / C), adjust((W - by) / C)]
    setState(state.move(p))
  }
  return <svg className="rjn-board" width={W} height={W} onClick={onClickBoard}>
    <Base
      C={C}
      showIndices={preference.showIndices}
    />
    <Properties
      C={C}
      board={state.board}
      showForbiddens={preference.showForbiddens}
      showPropertyRows={preference.showPropertyRows}
      showPropertyEyes={preference.showPropertyEyes}
    />
    <Stones
      C={C}
      moves={state.moves}
      showOrders={preference.showOrders}
      emphasizeLastMove={preference.emphasizeLastMove}
    />
  </svg>
}

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), N_LINES)

export default Default

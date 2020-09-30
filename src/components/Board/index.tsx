import React, { FC, useContext } from 'react'

import { Point, N_LINES } from '../../rule'
import { State } from '../../state'
import Base from './Base'
import Stones from './Stones'
import Properties from './Properties'
import { Preference } from '../preference'
import { SystemContext } from '../system'

type DefaultProps = {
  state: State
  setState: (s: State) => void
  preference: Preference
}

const Default: FC<DefaultProps> = ({
  state,
  setState,
  preference,
}) => {
  const system = useContext(SystemContext)
  const onClickBoard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(bx / system.C), adjust((system.W - by) / system.C)]
    setState(state.move(p))
  }
  return <svg className="rjn-board" width={system.W} height={system.W} onClick={onClickBoard}>
    <Base
      showIndices={preference.showIndices}
    />
    <Properties
      board={state.board}
      showForbiddens={preference.showForbiddens}
      showPropertyRows={preference.showPropertyRows}
      showPropertyEyes={preference.showPropertyEyes}
    />
    <Stones
      moves={state.moves}
      showOrders={preference.showOrders}
      emphasizeLastMove={preference.emphasizeLastMove}
    />
  </svg>
}

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), N_LINES)

export default Default

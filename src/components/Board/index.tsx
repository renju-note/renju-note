import React, { FC } from 'react'

import { Point } from '../../rule'
import { State } from '../../state'
import { C, N, WIDTH } from './coordinate'
import Base from './Base'
import Stones from './Stones'
import Properties from './Properties'
import { Preference } from '../preference'

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
  const onClickBoard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
    const p: Point = [adjust(bx / C), adjust((WIDTH - by) / C)]
    setState(state.move(p))
  }
  return <svg width={WIDTH} height={WIDTH} onClick={onClickBoard}>
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

const adjust = (n: number): number => Math.min(Math.max(1, Math.round(n)), N)

export default Default

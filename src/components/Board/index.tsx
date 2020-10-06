import React, { FC, useContext } from 'react'
import { PreferenceContext } from '../preference'
import { State } from '../state'
import { SystemContext } from '../system'
import Base from './Base'
import Properties from './Properties'
import Stones from './Stones'

type DefaultProps = {
  state: State
  setState: (s: State) => void
}

const Default: FC<DefaultProps> = ({
  state,
  setState,
}) => {
  const system = useContext(SystemContext)
  const preference = useContext(PreferenceContext)[0]
  const onClickBoard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
    setState(state.move(system.p([bx, by])))
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

export default Default

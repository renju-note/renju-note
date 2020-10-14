import React, { FC, useContext } from 'react'
import { AppStateContext } from '../appState'
import { PreferenceContext } from '../preference'
import { SystemContext } from '../system'
import Base from './Base'
import Properties from './Properties'
import Stones from './Stones'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppState] = useContext(AppStateContext)
  const preference = useContext(PreferenceContext)[0]

  const onClickBoard = (e: React.MouseEvent<SVGElement, MouseEvent>) => {
    const base = e.currentTarget.getBoundingClientRect()
    const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
    setAppState(appState.move(system.p([bx, by])))
  }
  return <svg className="rjn-board" width={system.W} height={system.W} onClick={onClickBoard}>
    <Base
      showIndices={preference.showIndices}
    />
    <Properties
      board={appState.board}
      showForbiddens={preference.showForbiddens}
      showPropertyRows={preference.showPropertyRows}
      showPropertyEyes={preference.showPropertyEyes}
    />
    <Stones
      moves={appState.moves}
      showOrders={preference.showOrders}
      emphasizeLastMove={preference.emphasizeLastMove}
    />
  </svg>
}

export default Default

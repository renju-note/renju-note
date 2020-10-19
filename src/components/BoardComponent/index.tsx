import React, { FC, useContext } from 'react'
import { Board, Point } from '../../rule'
import { PreferenceContext } from '../preference'
import { SystemContext } from '../system'
import Base from './Base'
import Properties from './Properties'
import Stones from './Stones'

type DefaultProps = {
  id: string
  board: Board
  moves: Point[]
  onClickPoint?: ([x, y]: Point) => void
}

const Default: FC<DefaultProps> = ({
  id,
  board,
  moves,
  onClickPoint,
}) => {
  const system = useContext(SystemContext)
  const preference = useContext(PreferenceContext)[0]

  const onClick = onClickPoint && (
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      const base = e.currentTarget.getBoundingClientRect()
      const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
      onClickPoint(system.p([bx, by]))
    }
  )
  return <svg id={id} className="rjn-board" width={system.W} height={system.W} onClick={onClick}>
    <Base
      showIndices={preference.showIndices}
    />
    <Properties
      board={board}
      showForbiddens={preference.showForbiddens}
      showPropertyRows={preference.showPropertyRows}
      showPropertyEyes={preference.showPropertyEyes}
    />
    <Stones
      moves={moves}
      showOrders={preference.showOrders}
      emphasizeLastMove={preference.emphasizeLastMove}
    />
  </svg>
}

export default Default

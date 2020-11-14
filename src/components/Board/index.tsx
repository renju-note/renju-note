import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { SystemContext } from '../contexts'
import Base from './Base'
import FreeStones from './FreeStones'
import Game from './Game'
import Markers from './Markers'
import Preview from './Preview'
import Properties from './Properties'

type DefaultProps = {
  id: string
  onClickPoint?: ([x, y]: Point) => void
}

const Default: FC<DefaultProps> = ({ id, onClickPoint }) => {
  const system = useContext(SystemContext)
  const onClick =
    onClickPoint &&
    ((e: React.MouseEvent<SVGElement, MouseEvent>) => {
      const base = e.currentTarget.getBoundingClientRect()
      const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
      onClickPoint(system.p([bx, by]))
    })
  return (
    <svg id={id} width={system.W} height={system.W} onClick={onClick}>
      <Base />
      <Properties />
      <Markers />
      <FreeStones />
      <Game />
      <Preview />
    </svg>
  )
}

export default Default

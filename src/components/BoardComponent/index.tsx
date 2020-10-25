import React, { FC, useContext } from 'react'
import { Point } from '../../rule'
import { SystemContext } from '../contexts'
import Base from './Base'
import Properties from './Properties'
import Stones from './Stones'
import Markers from './Markers'

type DefaultProps = {
  id: string
  onClickPoint?: ([x, y]: Point) => void
}

const Default: FC<DefaultProps> = ({
  id,
  onClickPoint,
}) => {
  const system = useContext(SystemContext)
  const onClick = onClickPoint && (
    (e: React.MouseEvent<SVGElement, MouseEvent>) => {
      const base = e.currentTarget.getBoundingClientRect()
      const [bx, by] = [e.clientX - base.x, e.clientY - base.y]
      onClickPoint(system.p([bx, by]))
    }
  )
  return <svg
    id={id}
    width={system.W}
    height={system.W}
    onClick={onClick}
  >
    <Base />
    <Properties />
    <Markers />
    <Stones />
  </svg>
}

export default Default

import React, { FC, useContext } from 'react'
import { BoardStateContext } from '../contexts'
import { Stones } from './common'

const Default: FC = () => {
  const { boardState } = useContext(BoardStateContext)
  return <g>
    <Stones
      black={true}
      points={boardState.freeBlacks.points}
    />
    <Stones
      black={false}
      points={boardState.freeWhites.points}
    />
  </g>
}

export default Default

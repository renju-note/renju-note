import { FC, useContext } from 'react'
import { BoardStateContext } from '../contexts'
import { Stone } from './common'

const Default: FC = () => {
  const { boardState } = useContext(BoardStateContext)
  const blacks = boardState.freeBlacks.points.map((p, key) => (
    <Stone key={key} point={p} black={true} />
  ))
  const whites = boardState.freeWhites.points.map((p, key) => (
    <Stone key={key} point={p} black={false} />
  ))
  return (
    <g>
      {blacks}
      {whites}
    </g>
  )
}

export default Default

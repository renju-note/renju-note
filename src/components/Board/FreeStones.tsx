import { FC } from 'react'
import { PointsState } from '../../state'
import { Stone } from './common'

type Props = {
  blacks: PointsState
  whites: PointsState
}

const Default: FC<Props> = ({ blacks, whites }) => (
  <g>
    {blacks.points.map((p, key) => (
      <Stone key={key} point={p} black={true} />
    ))}
    {whites.points.map((p, key) => (
      <Stone key={key} point={p} black={false} />
    ))}
  </g>
)

export default Default

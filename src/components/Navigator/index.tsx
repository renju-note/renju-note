import React, { FC } from 'react'

import { State } from '../../state'
import { code } from '../code'

type DefaultProps = {
  state: State
  setState: (s: State) => void
}

const Default: FC<DefaultProps> = ({
  state,
  setState
}) => {
  return <div>
    {
      state.game.moves.map((p, key) => {
        return <span

          key={key} onClick={() => setState(state)}
        >
          {code(p)}
        </span>
      })
    }
  </div>
}

export default Default

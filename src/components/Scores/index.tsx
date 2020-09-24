import React, { FC } from 'react'
import { Flex, Text, Link } from '@chakra-ui/core'

import { State } from '../../state'
import { code } from '../code'

type DefaultProps = {
  state: State
  setState: (s: State) => void
}

const Default: FC<DefaultProps> = ({
  state,
}) => {
  return <Flex width={640} overflowX="scroll" wrap="nowrap" justifyContent="center">
    {
      state.game.moves.map(
        (p, key) => <Link key={key}>
          <Text textAlign="center" fontFamily="Noto Serif" color="dimgray" fontSize="sm" width={8}>
            {key % 5 === 4 ? `${key + 1}` : key % 2 === 0 ? '•' : '⚬' }
          </Text>
          <Text textAlign="center" fontFamily="Noto Sans" color="dimgray" fontSize="sm" width={8}>
            {code(p)}
          </Text>
        </Link>
      )
    }
  </Flex>
}

export default Default

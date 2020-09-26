import React, { FC, useState } from 'react'
import { Stack, Text, Flex } from '@chakra-ui/core'

import { State } from '../state'
import Board from './Board'
import Controller from './Controller'
import { Preference } from './preference'

type DefaultProps = {
  width: number
}

const Default: FC<DefaultProps> = ({
  width,
}) => {
  const [state, setState] = useState<State>(new State({}))
  const [preference, setPreference] = useState<Preference>({
    showIndices: false,
    showOrders: false,
    emphasizeLastMove: false,
    showForbiddens: false,
    showPropertyRows: false,
    showPropertyEyes: false,
  })
  return (
    <Flex justify="center">
      <Stack spacing={4} my={2}>
        <Flex justify="center" align="center">
          <Text
            as="h1" textAlign="center"
            fontFamily="Noto Sans" fontWeight="normal" color="gray.500"
          >
            Renju Note BETA
          </Text>
        </Flex>
        <Flex justify="center" align="center">
          <Board
            width={width}
            state={state}
            setState={setState}
            preference={preference}
          />
        </Flex>
        <Flex justify="center" align="center">
          <Controller
            width={width}
            state={state}
            setState={setState}
            preference={preference}
            setPreference={setPreference}
          />
        </Flex>
      </Stack>
    </Flex>
  )
}

export default Default

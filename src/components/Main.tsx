import { Flex, Stack, Text } from '@chakra-ui/core'
import React, { FC, useState } from 'react'
import { State } from '../state'
import Board from './Board'
import Controller from './Controller'
import { Preference } from './preference'

const Default: FC = () => {
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
            state={state}
            setState={setState}
            preference={preference}
          />
        </Flex>
        <Flex justify="center" align="center">
          <Controller
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

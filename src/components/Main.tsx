import { Flex, Stack, Text } from '@chakra-ui/core'
import React, { FC, useEffect, useState } from 'react'
import { State } from '../state'
import Board from './Board'
import Controller from './Controller'
import { initialPreference, Preference } from './preference'

const Default: FC = () => {
  let initialState: State
  try {
    initialState = new State({ code: window.location.hash.slice(1) })
  } catch (e) {
    initialState = new State({})
  }
  const [state, setState] = useState<State>(initialState)
  const [preference, setPreference] = useState<Preference>(initialPreference)
  useEffect(
    () => {
      window.history.replaceState(null, '', `#${state.code}`)
    },
    [state.code]
  )
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

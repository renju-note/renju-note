import { Flex, Stack, Text } from '@chakra-ui/core'
import React, { FC, useEffect, useState } from 'react'
import Board from './Board'
import Controller from './Controller'
import { PreferenceContext, usePreference } from './preference'
import { State } from './state'
import { System, SystemContext } from './system'

const Default: FC = () => {
  const system = new System(window.innerWidth)
  const initialState = loadInitialState(window.location.hash)
  const [state, setState] = useState<State>(initialState)
  useEffect(
    () => {
      window.history.replaceState(null, '', `#${state.code}`)
    },
    [state.code]
  )

  const [preference, setPreference] = usePreference()
  useEffect(
    () => setPreference(preference),
    [preference],
  )
  return (
    <SystemContext.Provider value={system}>
      <PreferenceContext.Provider value={[preference, setPreference]}>
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
              />
            </Flex>
            <Flex justify="center" align="center">
              <Controller
                state={state}
                setState={setState}
              />
            </Flex>
          </Stack>
        </Flex>
      </PreferenceContext.Provider>
    </SystemContext.Provider>
  )
}

const loadInitialState = (windowLocationHash: string): State => {
  try {
    return new State({ code: windowLocationHash.slice(1) })
  } catch (e) {
    console.log(`Invalid fragment: '${windowLocationHash}'`)
    return new State({})
  }
}

export default Default

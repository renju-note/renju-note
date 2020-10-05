import { Flex, Stack, Text } from '@chakra-ui/core'
import React, { FC, useEffect, useState } from 'react'
import Board from './Board'
import Controller from './Controller'
import { Preference } from './preference'
import { State } from './state'
import { System, SystemContext } from './system'

const Default: FC = () => {
  const initialState = loadInitialState(window.location.hash)
  const [state, setState] = useState<State>(initialState)
  useEffect(
    () => {
      window.history.replaceState(null, '', `#${state.code}`)
    },
    [state.code]
  )

  const initialPreference = loadInitialPreference(localStorage.getItem('preference') || '{}')
  const [preference, setPreference] = useState<Preference>(initialPreference)
  useEffect(
    () => {
      localStorage.setItem('preference', JSON.stringify(preference))
    },
    [preference]
  )

  return (
    <SystemContext.Provider value={new System(window.innerWidth)}>
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

const loadInitialPreference = (localStoragePreference: string): Preference => {
  try {
    const partial = JSON.parse(localStoragePreference) as Partial<Preference>
    return new Preference(partial)
  } catch (e) {
    console.log(`Invalid preference: '${localStoragePreference}'`)
    return new Preference({})
  }
}

export default Default

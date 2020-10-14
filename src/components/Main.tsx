import { Flex, Stack, Text } from '@chakra-ui/core'
import React, { FC, useEffect } from 'react'
import { AppStateContext, useAppState } from './appState'
import Board from './Board'
import Controller from './Controller'
import { PreferenceContext, usePreference } from './preference'
import { setupSystem, SystemContext } from './system'

const Default: FC = () => {
  const system = setupSystem()

  const [appState, setAppState] = useAppState()
  useEffect(
    () => setAppState(appState),
    [appState]
  )

  const [preference, setPreference] = usePreference()
  useEffect(
    () => setPreference(preference),
    [preference],
  )

  return (
    <SystemContext.Provider value={system}>
      <AppStateContext.Provider value={[appState, setAppState]}>
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
                  state={appState}
                  setAppState={setAppState}
                />
              </Flex>
              <Flex justify="center" align="center">
                <Controller
                  state={appState}
                  setAppState={setAppState}
                />
              </Flex>
            </Stack>
          </Flex>
        </PreferenceContext.Provider>
      </AppStateContext.Provider>
    </SystemContext.Provider>
  )
}

export default Default

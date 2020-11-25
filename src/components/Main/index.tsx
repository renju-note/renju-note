import { Box, Flex, Stack } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import {
  AdvancedStateProvider,
  PreferenceContext,
  PreferenceOption,
  SystemContext,
} from '../contexts'
import Board from './Board'
import Controller from './Controller'
import Tabs from './Tabs'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { preference } = useContext(PreferenceContext)
  return (
    <AdvancedStateProvider>
      <Flex justify="center" align="top" wrap="wrap" mt="0.5rem">
        <Stack width={system.W} spacing="1rem">
          <Box>
            <Board />
          </Box>
          <Box>
            <Controller />
          </Box>
        </Stack>
        {preference.has(PreferenceOption.advancedMode) && (
          <Box width={system.W} mt="0.5rem">
            <Tabs />
          </Box>
        )}
      </Flex>
    </AdvancedStateProvider>
  )
}

export default Default

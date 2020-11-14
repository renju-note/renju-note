import { Box, Flex, Stack } from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { PreferenceContext, PreferenceOption, SystemContext } from '../contexts'
import Board from './Board'
import Controller from './Controller'
import Tabs from './Tabs'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const preference = useContext(PreferenceContext)[0]
  return <Flex justify="center" align="top" wrap="wrap" my="1rem">
    <Stack width={system.W} spacing="1rem">
      <Box>
        <Board />
      </Box>
      <Box>
        <Controller />
      </Box>
    </Stack>
    {
      preference.has(PreferenceOption.showTabs) &&
      <Box width={system.W} mt="1rem">
        <Tabs />
      </Box>
    }
  </Flex>
}

export default Default

import { Box, Flex, Stack } from '@chakra-ui/core'
import React, { FC, useContext } from 'react'
import { SystemContext } from '../contexts'
import Board from './Board'
import Controller from './Controller'
import Tabs from './Tabs'

const Default: FC = () => {
  const system = useContext(SystemContext)
  return <Flex justify="center" align="top" wrap="wrap" my="1rem">
    <Stack width={system.W} spacing="1rem">
      <Box>
        <Board />
      </Box>
      <Box>
        <Controller />
      </Box>
    </Stack>
    <Box width={system.W} mt="1rem">
      <Tabs />
    </Box>
  </Flex>
}

export default Default

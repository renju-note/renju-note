import { Box, Flex, Stack } from '@chakra-ui/core'
import React, { FC, useContext, useEffect, useState } from 'react'
import { ready } from '../../database'
import { SystemContext } from '../contexts'
import Board from './Board'
import Controller from './Controller'
import Tabs from './Tabs'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [databaseReady, setDatabaseReady] = useState<boolean>(false)
  useEffect(
    () => {
      (async () => setDatabaseReady(await ready()))()
    },
    []
  )
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
      databaseReady &&
      <Box width={system.W} mt="1rem">
        <Tabs />
      </Box>
    }
  </Flex>
}

export default Default

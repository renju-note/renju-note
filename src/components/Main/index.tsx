import { Flex, Stack } from '@chakra-ui/core'
import React, { FC } from 'react'
import Board from './Board'
import Controller from './Controller'
import Searcher from './Searcher'

const Default: FC = () => {
  return <Flex justify="center">
    <Stack spacing={4} my={2}>
      <Flex justify="center" align="center">
        <Board />
      </Flex>
      <Flex justify="center" align="center">
        <Controller />
      </Flex>
      <Flex justify="center" align="center">
        <Searcher />
      </Flex>
    </Stack>
  </Flex>
}

export default Default

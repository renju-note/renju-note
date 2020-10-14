import { Flex, Stack, Text } from '@chakra-ui/core'
import React, { FC } from 'react'
import Board from './Board'
import Controller from './Controller'

const Default: FC = () => {
  return <Flex justify="center">
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
        <Board />
      </Flex>
      <Flex justify="center" align="center">
        <Controller />
      </Flex>
    </Stack>
  </Flex>
}

export default Default

import { Stack } from '@chakra-ui/react'
import { FC } from 'react'
import Board from './Board'
import Controller from './Controller'

const Default: FC = () => {
  return (
    <Stack spacing="1rem">
      <Board />
      <Controller />
    </Stack>
  )
}

export default Default

import { Heading, Stack, Text } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useState } from 'react'
import { encodePointsWithSeparator } from '../../../../rule'
import { BoardStateContext } from '../../../contexts'

const Default: FC = () => {
  const { gameState } = useContext(BoardStateContext)
  const [quintetModule, setQuintetModule] = useState<any>()
  const [quintetMessage, setQuintetMessage] = useState<string>('')
  useEffect(() => {
    import('@renju-note/quintet').then(m => setQuintetModule(m))
  }, [])
  useEffect(() => {
    if (quintetModule === undefined) return
    const code = encodePointsWithSeparator(gameState.current.moves, ',')
    console.log(code)
    const message = quintetModule.solve_vcf(code, 30, false)
    console.log(message)
    setQuintetMessage(message)
  }, [gameState.current.size])
  return (
    <Stack px="1rem" fontFamily="Noto Serif" color="gray.800">
      <Heading as="h2" size="sm">
        VCF
      </Heading>
      <Text pl="1rem">{quintetMessage}</Text>
    </Stack>
  )
}

export default Default

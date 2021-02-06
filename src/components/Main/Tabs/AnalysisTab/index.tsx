import { Heading, Stack, Text } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useState } from 'react'
import { encodePoints, Point } from '../../../../rule'
import { BoardStateContext } from '../../../contexts'

const Default: FC = () => {
  const { boardState, gameState } = useContext(BoardStateContext)
  const [quintetModule, setQuintetModule] = useState<any>()
  const [quintetMessage, setQuintetMessage] = useState<string>('')
  useEffect(() => {
    import('@renju-note/quintet').then(m => setQuintetModule(m))
  }, [])
  useEffect(() => {
    if (quintetModule === undefined) return
    const blacks = new Uint8Array(boardState.current.blacks.map(encodeXY))
    const whites = new Uint8Array(boardState.current.whites.map(encodeXY))
    const result: Uint8Array = quintetModule.solve_vcf(
      blacks,
      whites,
      gameState.isBlackTurn,
      10,
      false
    )
    if (result) {
      setQuintetMessage(encodePoints(Array.from(result).map(decodeXY)))
    } else {
      setQuintetMessage('')
    }
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

const encodeXY = (p: Point): number => (p[0] - 1) * 15 + p[1] - 1

const decodeXY = (c: number): Point => [~~(c / 15) + 1, (c % 15) + 1]

export default Default

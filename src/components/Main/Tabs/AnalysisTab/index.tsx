import {
  Button,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useState } from 'react'
import { RiClipboardLine } from 'react-icons/ri'
import { encodePoints, Point } from '../../../../rule'
import { BoardStateContext } from '../../../contexts'

const DEPTH_LIMIT = 25

const Default: FC = () => {
  const { boardState } = useContext(BoardStateContext)
  const [quintet, setQuintet] = useState<any>()
  useEffect(() => {
    import('@renju-note/quintet').then(quintet => setQuintet(quintet))
  }, [])

  const [blackSolution, setBlackSolution] = useState<Point[]>([])
  const [whiteSolution, setWhiteSolution] = useState<Point[]>([])
  const onSolve = (black: boolean) => {
    if (quintet === undefined) return
    const blacks = new Uint8Array(boardState.current.blacks.map(encodeXY))
    const whites = new Uint8Array(boardState.current.whites.map(encodeXY))
    const rawSolution: Uint8Array = quintet.solve_vcf(blacks, whites, black, DEPTH_LIMIT, false)
    const solution = rawSolution === undefined ? [] : Array.from(rawSolution).map(decodeXY)
    if (black) {
      setBlackSolution(solution)
    } else {
      setWhiteSolution(solution)
    }
  }

  const boardCode =
    encodePoints(boardState.current.blacks, ',') +
    '/' +
    encodePoints(boardState.current.whites, ',')
  const { onCopy } = useClipboard(boardCode)
  return (
    <Stack px="1rem">
      <InputGroup size="sm">
        <Input size="sm" type="string" placeholder="blacks/whites" value={boardCode} isReadOnly />
        <InputRightElement>
          <IconButton aria-label="copy" size="xs" icon={<RiClipboardLine />} onClick={onCopy} />
        </InputRightElement>
      </InputGroup>
      <Heading as="h2" size="sm">
        VCF
      </Heading>
      <Button onClick={() => onSolve(true)}>Black</Button>
      <Text pl="1rem">{encodePoints(blackSolution)}</Text>
      <Button onClick={() => onSolve(false)}>White</Button>
      <Text pl="1rem">{encodePoints(whiteSolution)}</Text>
    </Stack>
  )
}

const encodeXY = (p: Point): number => (p[0] - 1) * 15 + p[1] - 1

const decodeXY = (c: number): Point => [~~(c / 15) + 1, (c % 15) + 1]

export default Default

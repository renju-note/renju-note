import {
  Badge,
  Box,
  Button,
  ButtonGroup,
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputRightElement,
  Link,
  Stack,
  Text,
  useClipboard,
} from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useState } from 'react'
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiClipboardLine,
  RiRadioButtonLine,
} from 'react-icons/ri'
import { encodePoints, Point } from '../../../../rule'
import { BoardStateContext } from '../../../contexts'

const DEPTH_LIMIT = 100

const Default: FC = () => {
  return (
    <Stack>
      <Heading as="h2" size="sm">
        Current state
      </Heading>
      <CurrentStateComponent />
      <Heading as="h2" size="sm" pt="1rem">
        VCF
      </Heading>
      <VCFComponent />
      <Text color="gray.600" pt="3rem" pb="1rem" textAlign="center">
        Powered by&nbsp;
        <Link href="https://github.com/renju-note/quintet" color="teal.500" isExternal>
          quintet
        </Link>
        .
      </Text>
    </Stack>
  )
}

const CurrentStateComponent: FC = () => {
  const { boardState, gameState } = useContext(BoardStateContext)
  return (
    <Stack>
      <StonesInput icon={<RiRadioButtonLine />} ps={gameState.current.moves} />
      <StonesInput icon={<RiCheckboxBlankCircleFill />} ps={boardState.current.blacks} />
      <StonesInput icon={<RiCheckboxBlankCircleLine />} ps={boardState.current.whites} />
    </Stack>
  )
}

const VCFComponent: FC = () => {
  const { boardState } = useContext(BoardStateContext)
  const [quintet, setQuintet] = useState<any>()
  useEffect(() => {
    import('@renju-note/quintet').then(quintet => setQuintet(quintet))
  }, [])

  const [vcfTurn, setVcfTurn] = useState<boolean>(true)
  const [solution, setSolution] = useState<Point[]>()
  const [solving, setSolving] = useState<boolean>(false)
  const onSolve = () => {
    if (quintet === undefined) return
    const blacks = new Uint8Array(boardState.current.blacks.map(encodeXY))
    const whites = new Uint8Array(boardState.current.whites.map(encodeXY))
    setSolving(true)
    const rawSolution: Uint8Array = quintet.solve_vcf(blacks, whites, vcfTurn, DEPTH_LIMIT, false)
    const solution = rawSolution === undefined ? [] : Array.from(rawSolution).map(decodeXY)
    setSolution(solution)
    setSolving(false)
  }
  return (
    <>
      <Flex>
        <Stack isInline>
          <ButtonGroup size="sm" isAttached>
            <IconButton
              aria-label="black"
              width="3rem"
              icon={<RiCheckboxBlankCircleFill />}
              variant={vcfTurn ? 'solid' : 'outline'}
              onClick={() => setVcfTurn(true)}
            />
            <IconButton
              aria-label="white"
              width="3rem"
              icon={<RiCheckboxBlankCircleLine />}
              variant={!vcfTurn ? 'solid' : 'outline'}
              onClick={() => setVcfTurn(false)}
            />
          </ButtonGroup>
          {solution === undefined ? (
            <Button isLoading={solving} size="sm" colorScheme="purple" onClick={onSolve}>
              Solve
            </Button>
          ) : (
            <Button size="sm" onClick={() => setSolution(undefined)}>
              Clear
            </Button>
          )}
        </Stack>
        <Box marginLeft="auto">
          {solution !== undefined &&
            (solution.length !== 0 ? (
              <Badge colorScheme="green">found</Badge>
            ) : (
              <Badge colorScheme="red">not found</Badge>
            ))}
        </Box>
      </Flex>
      {solution !== undefined && solution.length !== 0 && (
        <Box>
          <StonesInput icon={<RiRadioButtonLine />} ps={solution} />
        </Box>
      )}
    </>
  )
}

const StonesInput: FC<{ icon: React.ReactElement; ps: Point[] }> = ({ icon, ps }) => {
  const code = encodePoints(ps, ',')
  const { onCopy } = useClipboard(code)
  return (
    <InputGroup size="sm">
      <InputLeftAddon width="5rem">
        {icon} &nbsp; {ps.length}
      </InputLeftAddon>
      <Input type="string" isReadOnly value={code} />
      <InputRightElement>
        <IconButton aria-label="copy" size="xs" icon={<RiClipboardLine />} onClick={onCopy} />
      </InputRightElement>
    </InputGroup>
  )
}

const encodeXY = (p: Point): number => (p[0] - 1) * 15 + p[1] - 1

const decodeXY = (c: number): Point => [~~(c / 15) + 1, (c % 15) + 1]

export default Default

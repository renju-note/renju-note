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
  SimpleGrid,
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
// eslint-disable-next-line
import Worker from 'worker-loader!./quintet'
import { encodePoints, Point } from '../../../../rule'
import { BoardStateContext } from '../../../contexts'

const worker = new Worker()

const DEPTH_LIMIT = 100

const Default: FC = () => {
  return (
    <Stack>
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
      </Text>
    </Stack>
  )
}

const CurrentStateComponent: FC = () => {
  const { boardState } = useContext(BoardStateContext)
  return (
    <SimpleGrid width="100%" columns={2} spacing={1} minChildWidth="240px">
      <StonesInput
        icon={<RiCheckboxBlankCircleFill />}
        ps={boardState.current.blacks}
        placeholder="black stones"
      />
      <StonesInput
        icon={<RiCheckboxBlankCircleLine />}
        ps={boardState.current.whites}
        placeholder="white stones"
      />
    </SimpleGrid>
  )
}

const VCFComponent: FC = () => {
  const { boardState, setBoardState } = useContext(BoardStateContext)
  const [quintet, setQuintet] = useState<any>()
  useEffect(() => {
    import('@renju-note/quintet').then(quintet => setQuintet(quintet))
  }, [])

  const [vcfTurn, setVcfTurn] = useState<boolean>(true)
  const [solution, setSolution] = useState<Point[]>()
  const [solving, setSolving] = useState<boolean>(false)
  const onSolve = () => {
    worker.postMessage({ a: 1 })
    if (quintet === undefined) return
    const blacks = new Uint8Array(boardState.current.blacks.map(encodeXY))
    const whites = new Uint8Array(boardState.current.whites.map(encodeXY))
    setSolving(true)
    const rawSolution: Uint8Array = quintet.solve_vcf(blacks, whites, vcfTurn, DEPTH_LIMIT, false)
    const solution = rawSolution === undefined ? [] : Array.from(rawSolution).map(decodeXY)
    setSolution(solution)
    setSolving(false)
    setBoardState(boardState.setNumberdedPoints(solution.filter((_, i) => i % 2 === 0)))
  }
  const onClear = () => {
    setSolution(undefined)
    setBoardState(boardState.setNumberdedPoints([]))
  }
  return (
    <Stack>
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
            <Button size="sm" onClick={onClear}>
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
        <StonesInput icon={<RiRadioButtonLine />} ps={solution} placeholder="solution" />
      )}
    </Stack>
  )
}

const StonesInput: FC<{ icon: React.ReactElement; ps: Point[]; placeholder: string }> = ({
  icon,
  ps,
  placeholder,
}) => {
  const code = encodePoints(ps, ',')
  const { onCopy } = useClipboard(code)
  return (
    <InputGroup size="sm">
      <InputLeftAddon width="5rem">
        {icon} &nbsp; {ps.length}
      </InputLeftAddon>
      <Input type="string" isReadOnly value={code} placeholder={placeholder} />
      <InputRightElement>
        <IconButton aria-label="copy" size="xs" icon={<RiClipboardLine />} onClick={onCopy} />
      </InputRightElement>
    </InputGroup>
  )
}

const encodeXY = (p: Point): number => (p[0] - 1) * 15 + p[1] - 1

const decodeXY = (c: number): Point => [~~(c / 15) + 1, (c % 15) + 1]

export default Default

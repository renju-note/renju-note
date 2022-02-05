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
  useToast,
} from '@chakra-ui/react'
import * as React from 'react'
import { FC, useContext, useState } from 'react'
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiClipboardLine,
  RiRadioButtonLine,
} from 'react-icons/ri'
import { Player, Point, wrapBoard, wrapPoints } from 'renjukit'
// eslint-disable-next-line
import Worker from 'worker-loader!./quintet'
import { Game } from '../../../rule'
import { GameState } from '../../../state'
import { BasicContext } from '../../contexts'

const workerVcf = new Worker()
const workerVct = new Worker()

const DEPTH_LIMIT = 100

const Default: FC = () => {
  return (
    <Stack>
      <CurrentStateComponent />
      <Heading as="h2" size="sm" pt="1rem">
        VCF
      </Heading>
      <VCFComponent />
      <Heading as="h2" size="sm" pt="1rem">
        VCT (unstable)
      </Heading>
      <VCTComponent />
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
  const { boardState } = useContext(BasicContext)
  const current = wrapBoard(boardState.current)
  return (
    <SimpleGrid width="100%" columns={2} spacing={1} minChildWidth="240px">
      <StonesInput
        icon={<RiCheckboxBlankCircleFill />}
        ps={current.stones(Player.black)}
        placeholder="black stones"
      />
      <StonesInput
        icon={<RiCheckboxBlankCircleLine />}
        ps={current.stones(Player.white)}
        placeholder="white stones"
      />
    </SimpleGrid>
  )
}

const VCFComponent: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const current = wrapBoard(boardState.current)

  const [turn, setTurn] = useState<boolean>(true)
  const [solution, setSolution] = useState<Point[]>()
  const [solving, setSolving] = useState<boolean>(false)

  workerVcf.onmessage = (event: MessageEvent) => {
    const { solution } = event.data as { solution: Point[] }
    setSolution(solution)
    setBoardState(boardState.setNumberdedPoints(solution.filter((_, i) => i % 2 === 0)))
    setSolving(false)
  }
  const onSolve = () => {
    const data = {
      kind: 'vcf',
      blacks: current.stones(Player.black),
      whites: current.stones(Player.white),
      turn: turn,
      depthLimit: DEPTH_LIMIT,
    }
    workerVcf.postMessage(data)
    setSolving(true)
  }
  const onPut = () => {
    if (solution === undefined || solution.length === 0) return
    const message = 'All of existent moves will be converted to free (unordered) stones. OK?'
    if (!window.confirm(message)) return
    const newGame = new GameState({ main: new Game({ moves: solution, inverted: !turn }) })
    const newBoard = boardState.convertMovesToStones().setNumberdedPoints([]).setGame(newGame)
    setBoardState(newBoard)
    setSolution(undefined)
  }
  const onClear = () => {
    setBoardState(boardState.setNumberdedPoints([]))
    setSolution(undefined)
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
              variant={turn ? 'solid' : 'outline'}
              onClick={() => setTurn(true)}
            />
            <IconButton
              aria-label="white"
              width="3rem"
              icon={<RiCheckboxBlankCircleLine />}
              variant={!turn ? 'solid' : 'outline'}
              onClick={() => setTurn(false)}
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
          {solution !== undefined && solution.length > 0 && (
            <Button size="sm" variant="outline" colorScheme="purple" onClick={onPut}>
              Move on Board
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

const VCTComponent: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const current = wrapBoard(boardState.current)

  const [turn, setTurn] = useState<boolean>(true)
  const [solution, setSolution] = useState<Point[]>()
  const [solving, setSolving] = useState<boolean>(false)

  workerVct.onmessage = (event: MessageEvent) => {
    const { solution } = event.data as { solution: Point[] }
    setSolution(solution)
    setBoardState(boardState.setNumberdedPoints(solution.filter((_, i) => i % 2 === 0)))
    setSolving(false)
  }
  const onSolve = () => {
    const data = {
      kind: 'vct',
      blacks: current.stones(Player.black),
      whites: current.stones(Player.white),
      turn: turn,
      depthLimit: DEPTH_LIMIT,
    }
    workerVct.postMessage(data)
    setSolving(true)
  }
  const onPut = () => {
    if (solution === undefined || solution.length === 0) return
    const message = 'All of existent moves will be converted to free (unordered) stones. OK?'
    if (!window.confirm(message)) return
    const newGame = new GameState({ main: new Game({ moves: solution, inverted: !turn }) })
    const newBoard = boardState.convertMovesToStones().setNumberdedPoints([]).setGame(newGame)
    setBoardState(newBoard)
    setSolution(undefined)
  }
  const onClear = () => {
    setBoardState(boardState.setNumberdedPoints([]))
    setSolution(undefined)
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
              variant={turn ? 'solid' : 'outline'}
              onClick={() => setTurn(true)}
            />
            <IconButton
              aria-label="white"
              width="3rem"
              icon={<RiCheckboxBlankCircleLine />}
              variant={!turn ? 'solid' : 'outline'}
              onClick={() => setTurn(false)}
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
          {solution !== undefined && solution.length > 0 && (
            <Button size="sm" variant="outline" colorScheme="purple" onClick={onPut}>
              Move on Board
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
  const toast = useToast()
  const code = wrapPoints(ps).toString()
  const { onCopy, value } = useClipboard(code)
  const onClickCopy = () => {
    if (!value) return
    onCopy()
    toast({
      title: 'Copied.',
      description: `Paste them as you need.`,
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  }
  return (
    <InputGroup size="sm">
      <InputLeftAddon width="5rem">
        {icon} &nbsp; {ps.length}
      </InputLeftAddon>
      <Input type="string" isReadOnly value={code} placeholder={placeholder} />
      <InputRightElement>
        <IconButton aria-label="copy" size="xs" icon={<RiClipboardLine />} onClick={onClickCopy} />
      </InputRightElement>
    </InputGroup>
  )
}

export default Default

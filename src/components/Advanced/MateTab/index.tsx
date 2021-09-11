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
import * as React from 'react'
import { FC, useContext, useState } from 'react'
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiClipboardLine,
  RiRadioButtonLine,
} from 'react-icons/ri'
// eslint-disable-next-line
import Worker from 'worker-loader!./quintet'
import { encodePoints, Game, Point } from '../../../rule'
import { GameState } from '../../../state'
import { BasicContext } from '../../contexts'

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
  const { boardState } = useContext(BasicContext)
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
  const { boardState, setBoardState } = useContext(BasicContext)

  const [vcfTurn, setVcfTurn] = useState<boolean>(true)
  const [solution, setSolution] = useState<Point[]>()
  const [solving, setSolving] = useState<boolean>(false)

  worker.onmessage = (event: MessageEvent) => {
    const { solution } = event.data as { solution: Point[] }
    setSolution(solution)
    setBoardState(boardState.setNumberdedPoints(solution.filter((_, i) => i % 2 === 0)))
    setSolving(false)
  }
  const onSolve = () => {
    const data = {
      blacks: boardState.current.blacks,
      whites: boardState.current.whites,
      turn: vcfTurn,
      depthLimit: DEPTH_LIMIT,
    }
    worker.postMessage(data)
    setSolving(true)
  }
  const onPut = () => {
    if (solution === undefined || solution.length === 0) return
    const message = 'All of existent moves will be converted to free (unordered) stones. OK?'
    if (!window.confirm(message)) return
    const newGame = new GameState({ main: new Game({ moves: solution, inverted: !vcfTurn }) })
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

export default Default

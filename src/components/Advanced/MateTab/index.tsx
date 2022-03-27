import {
  Button,
  ButtonGroup,
  IconButton,
  Input,
  InputGroup,
  InputLeftAddon,
  InputLeftElement,
  InputRightElement,
  Link,
  SimpleGrid,
  Stack,
  Text,
  useClipboard,
  useToast,
  Spinner,
  useNumberInput,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Heading,
  List,
  ListItem,
  ListIcon,
  Wrap,
  Divider,
} from '@chakra-ui/react'
import * as React from 'react'
import { FC, useContext, useState } from 'react'
import {
  RiCheckboxBlankCircleFill,
  RiCheckboxBlankCircleLine,
  RiClipboardLine,
  RiContrastFill,
  RiRadioButtonLine,
} from 'react-icons/ri'
import { Player, Point, wrapBoard, wrapPoints } from 'renjukit'
// eslint-disable-next-line
import Worker from 'worker-loader!./quintet'
import { Game } from '../../../rule'
import { GameState } from '../../../state'
import { BasicContext, PreferenceContext, PreferenceOption } from '../../contexts'

type MateMode = 'vcf' | 'vct'

const Default: FC = () => (
  <Stack>
    <MateComponent />
    <Divider />
    <CurrentStateComponent />
    <Text color="gray.600" pt="2rem" pb="1rem" textAlign="center">
      Powered by&nbsp;
      <Link href="https://github.com/renju-note/quintet" color="teal.500" isExternal>
        quintet
      </Link>
    </Text>
  </Stack>
)

const MateComponent: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const current = wrapBoard(boardState.current)

  const [turn, setTurn] = useState<boolean>(true)
  const [mode, setMode] = useState<MateMode>('vcf')
  const [limit, setLimit] = useState<number>(8)
  const [threatLimit, setThreatLimit] = useState<number>(3)
  const [solution, setSolution] = useState<Point[]>()
  const [solving, setSolving] = useState<boolean>(false)

  const [worker, setWorker] = useState(() => new Worker())

  worker.onmessage = (event: MessageEvent) => {
    const { solution, turn } = event.data as { solution: Point[]; turn: boolean }
    setSolution(solution)
    setBoardState(boardState.setMarkerPath(solution).setPathTurn(turn))
    setSolving(false)
  }

  const onSolve = () => {
    const data = {
      turn,
      mode,
      limit,
      threatLimit,
      blacks: current.stones(Player.black),
      whites: current.stones(Player.white),
    }
    worker.postMessage(data)
    setSolving(true)
  }

  const onClear = () => {
    setBoardState(boardState.setMarkerPath([]))
    setSolution(undefined)
  }

  const onAbort = () => {
    worker.terminate()
    setWorker(new Worker())
    setSolving(false)
  }
  return (
    <>
      <SolveButton
        solution={solution}
        solving={solving}
        onSolve={onSolve}
        onAbort={onAbort}
        onClear={onClear}
      />
      <Wrap>
        <TurnButtonGroup turn={turn} setTurn={setTurn} />
        <ModeButtonGroup kind={mode} setKind={setMode} />
        <LimitButtonGroup placeholder="Length" limit={limit} setLimit={setLimit} />
        {mode === 'vct' && (
          <LimitButtonGroup placeholder="Threat" limit={threatLimit} setLimit={setThreatLimit} />
        )}
        <HelpButton />
      </Wrap>
      {solution !== undefined && solution.length !== 0 && (
        <>
          <Divider />
          <SolutionComponent
            turn={turn}
            solution={solution}
            onClearSolution={() => setSolution(undefined)}
          />
        </>
      )}
    </>
  )
}

const SolveButton: FC<{
  solution: Point[] | undefined
  solving: boolean
  onSolve: () => void
  onAbort: () => void
  onClear: () => void
}> = ({ solution, solving, onSolve, onAbort, onClear }) => {
  if (solving) {
    return (
      <Button size="sm" variant="outline" colorScheme="blue" onClick={onAbort}>
        <Spinner size="sm" mr="0.5rem" />
        Press to Abort
      </Button>
    )
  } else if (solution !== undefined && solution.length === 0) {
    return (
      <Button size="sm" variant="outline" colorScheme="red" onClick={onClear}>
        Not Found. (Press to Reset)
      </Button>
    )
  } else if (solution !== undefined && solution.length !== 0) {
    return (
      <Button size="sm" variant="outline" colorScheme="green" onClick={onClear}>
        Found! (Press to Reset)
      </Button>
    )
  } else {
    return (
      <Button size="sm" colorScheme="blue" onClick={onSolve}>
        Solve
      </Button>
    )
  }
}

const TurnButtonGroup: FC<{ turn: boolean; setTurn: (turn: boolean) => void }> = ({
  turn,
  setTurn,
}) => (
  <ButtonGroup size="sm" isAttached>
    <IconButton
      width="3rem"
      variant={turn ? 'solid' : 'outline'}
      onClick={() => setTurn(true)}
      icon={<RiCheckboxBlankCircleFill />}
      aria-label="black"
    />
    <IconButton
      width="3rem"
      variant={!turn ? 'solid' : 'outline'}
      onClick={() => setTurn(false)}
      icon={<RiCheckboxBlankCircleLine />}
      aria-label="white"
    />
  </ButtonGroup>
)

const ModeButtonGroup: FC<{ kind: MateMode; setKind: (kind: MateMode) => void }> = ({
  kind,
  setKind,
}) => (
  <ButtonGroup size="sm" isAttached>
    <Button
      width="3rem"
      variant={kind === 'vcf' ? 'solid' : 'outline'}
      onClick={() => setKind('vcf')}
    >
      VCF
    </Button>
    <Button
      width="3rem"
      variant={kind === 'vct' ? 'solid' : 'outline'}
      onClick={() => setKind('vct')}
    >
      VCT
    </Button>
  </ButtonGroup>
)

const LimitButtonGroup: FC<{ placeholder: string; limit: number; setLimit: (d: number) => void }> =
  ({ placeholder, limit, setLimit }) => {
    const { getInputProps, getIncrementButtonProps, getDecrementButtonProps } = useNumberInput({
      step: 2,
      min: 1,
      max: 225,
      value: limit * 2 - 1,
      onChange: s => setLimit(~~((parseInt(s, 10) + 1) / 2)),
    })

    const inc = getIncrementButtonProps()
    const dec = getDecrementButtonProps()
    const input = getInputProps({ readOnly: true })
    return (
      <ButtonGroup size="sm" isAttached>
        <Button {...dec}>-</Button>
        <InputGroup size="sm" mr="-1px">
          <InputLeftElement ml="1rem">{placeholder}:</InputLeftElement>
          <Input width="6rem" textAlign="right" {...input} />
        </InputGroup>
        <Button {...inc}>+</Button>
      </ButtonGroup>
    )
  }

const HelpButton: FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  return (
    <>
      <Button size="sm" onClick={onOpen}>
        Help
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Mate Solver Usage</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack>
              <Heading as="h2" size="sm">
                Player
              </Heading>
              <Text>Swiches which player is attaking.</Text>
              <List>
                <ListItem>
                  <ListIcon as={RiCheckboxBlankCircleFill} />
                  Black to attack
                </ListItem>
                <ListItem>
                  <ListIcon as={RiCheckboxBlankCircleLine} />
                  White to attack{' '}
                </ListItem>
              </List>
              <Heading as="h2" size="sm">
                Type
              </Heading>
              <Text>Swiches type of mate.</Text>
              <List>
                <ListItem>VCF: victory by continuous four</ListItem>
                <ListItem>VCT: victory by continuous threat</ListItem>
              </List>
              <Heading as="h2" size="sm">
                Length
              </Heading>
              <Text>
                Limit of mate length i.e. max number of moves to win. Win means open four or four on
                forbidden point.
              </Text>
              <List>
                <ListItem>1 = one attack to win </ListItem>
                <ListItem>3 = attack, defence and attack to win</ListItem>
                <ListItem>...</ListItem>
              </List>
              <Heading as="h2" size="sm">
                Threat
              </Heading>
              <Text>
                Limit of threat length. Threat means attacker&apos;s move that can make VCF if
                defender passed after it. If this value is increased, the solver takes account of
                more advanced attacks like mise-moves or fukumi-moves but will be slower.
              </Text>
              <List>
                <ListItem>1 = use only three and four moves</ListItem>
                <ListItem>3 = use 3-four-moves-to-win moves (or mise-moves)</ListItem>
                <ListItem>...</ListItem>
              </List>
            </Stack>
          </ModalBody>
          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

const SolutionComponent: FC<{
  turn: boolean
  solution: Point[]
  onClearSolution: () => void
}> = ({ turn, solution, onClearSolution }) => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const onPut = () => {
    const message = 'All of existent moves will be converted to free (unordered) stones. OK?'
    if (!window.confirm(message)) return
    const newGame = new GameState({ main: new Game({ moves: solution, inverted: !turn }) })
    const newBoard = boardState.convertMovesToStones().setMarkerPath([]).setGame(newGame)
    setBoardState(newBoard)
    onClearSolution()
  }
  return (
    <Stack>
      <StonesInput icon={<RiRadioButtonLine />} ps={solution} placeholder="solution" />
      <Stack isInline>
        <AppearanceButtonGroup />
        <Button size="sm" variant="outline" onClick={onPut}>
          Move on Board
        </Button>
      </Stack>
    </Stack>
  )
}

const AppearanceButtonGroup: FC = () => {
  const { preference, setPreference } = useContext(PreferenceContext)
  const isOn = preference.has(PreferenceOption.pathEveryOther)
  const setOn = () => setPreference(preference.on([PreferenceOption.pathEveryOther]))
  const setOff = () => setPreference(preference.off([PreferenceOption.pathEveryOther]))
  return (
    <ButtonGroup size="sm" isAttached>
      <IconButton
        width="3rem"
        variant={isOn ? 'solid' : 'outline'}
        onClick={setOn}
        icon={<RiRadioButtonLine />}
        aria-label="everyOther"
      />
      <IconButton
        width="3rem"
        variant={!isOn ? 'solid' : 'outline'}
        onClick={setOff}
        icon={<RiContrastFill />}
        aria-label="eachFrom"
      />
    </ButtonGroup>
  )
}

const CurrentStateComponent: FC = () => {
  const { boardState } = useContext(BasicContext)
  const current = wrapBoard(boardState.current)
  return (
    <>
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
      <StonesInput
        icon={<RiRadioButtonLine />}
        ps={boardState.game.current.moves}
        placeholder="moves"
      />
    </>
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

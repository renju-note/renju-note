import {
  Button,
  ButtonGroup,
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
  Spinner,
  useNumberInput,
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
    <CurrentStateComponent />
    <MateComponent />
    <Text color="gray.600" pt="3rem" pb="1rem" textAlign="center">
      Powered by&nbsp;
      <Link href="https://github.com/renju-note/quintet" color="teal.500" isExternal>
        quintet
      </Link>
    </Text>
  </Stack>
)

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

const MateComponent: FC = () => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const current = wrapBoard(boardState.current)

  const [mode, setMode] = useState<MateMode>('vcf')
  const [limit, setLimit] = useState<number>(8)
  const [turn, setTurn] = useState<boolean>(true)
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
      mode,
      limit,
      blacks: current.stones(Player.black),
      whites: current.stones(Player.white),
      turn,
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
      <Stack isInline>
        <ModeButtonGroup kind={mode} setKind={setMode} />
        <TurnButtonGroup turn={turn} setTurn={setTurn} />
        <LimitButtonGroup limit={limit} setLimit={setLimit} />
      </Stack>
      <SolveButton
        solution={solution}
        solving={solving}
        onSolve={onSolve}
        onAbort={onAbort}
        onClear={onClear}
      />
      {solution !== undefined && solution.length !== 0 && (
        <SolutionComponent
          turn={turn}
          solution={solution}
          onClearSolution={() => setSolution(undefined)}
        />
      )}
    </>
  )
}

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

const LimitButtonGroup: FC<{ limit: number; setLimit: (d: number) => void }> = ({
  limit,
  setLimit,
}) => {
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
      <Input size="sm" width="3rem" textAlign="right" {...input} />
      <Button {...inc}>+</Button>
    </ButtonGroup>
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
    <>
      <StonesInput icon={<RiRadioButtonLine />} ps={solution} placeholder="solution" />
      <Stack isInline>
        <AppearanceButtonGroup />
        <Button size="sm" variant="ghost" onClick={onPut}>
          Move on Board
        </Button>
      </Stack>
    </>
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

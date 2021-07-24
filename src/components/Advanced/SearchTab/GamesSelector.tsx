import {
  Box,
  Button,
  ButtonGroup,
  Center,
  IconButton,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { GameView, playerShortName, RIFDatabase, ruleShortName } from '../../../database'
import { Game } from '../../../rule'
import {
  BoardMode,
  BoardState,
  ConfirmOption,
  ConfirmState,
  GameState,
  PagerState,
} from '../../../state'
import { AdvancedContext, BasicContext } from '../../contexts'
import { WonIcon } from '../common'

const Default: FC = () => {
  const { searchState } = useContext(AdvancedContext)
  const [pager, setPager] = useState<PagerState>(new PagerState())
  useEffect(() => {
    setPager(new PagerState({ hit: searchState.gameIds.length }))
  }, [searchState.gameIds])
  const gameIds = searchState.gameIds.slice(pager.pageStart, pager.pageEnd)
  return (
    <>
      <Center>
        <PagerController pager={pager} setPager={setPager} />
      </Center>
      <Box width="100%">
        <GamesTable gameIds={gameIds} pager={pager} />
      </Box>
    </>
  )
}

const PagerController: FC<{ pager: PagerState; setPager: (p: PagerState) => void }> = ({
  pager,
  setPager,
}) => {
  return (
    <ButtonGroup spacing={1} size="sm" variant="ghost">
      <IconButton
        aria-label="first"
        icon={<FiChevronsLeft />}
        isDisabled={pager.isFirst}
        onClick={() => setPager(pager.toFirst())}
      />
      <IconButton
        aria-label="prev"
        icon={<FiChevronLeft />}
        isDisabled={pager.isFirst}
        onClick={() => setPager(pager.prev())}
      />
      <Button isDisabled width="8rem">
        {pager.toString()}
      </Button>
      <IconButton
        aria-label="next"
        icon={<FiChevronRight />}
        isDisabled={pager.isLast}
        onClick={() => setPager(pager.next())}
      />
      <IconButton
        aria-label="last"
        icon={<FiChevronsRight />}
        isDisabled={pager.isLast}
        onClick={() => setPager(pager.toLast())}
      />
    </ButtonGroup>
  )
}

const GamesTable: FC<{ gameIds: number[]; pager: PagerState }> = ({ gameIds, pager }) => {
  const db = useMemo(() => new RIFDatabase(), [])

  const [items, setItems] = useState<GameView[]>([])
  useEffect(() => {
    if (gameIds.length === 0) {
      setItems([])
      return
    }
    ;(async () => setItems(await db.getGameViews(gameIds)))()
  }, [gameIds])

  const { boardState, setBoardState, setConfirmState } = useContext(BasicContext)
  const isPreviewMode = boardState.mode === BoardMode.preview
  const [hiddenGame, setHiddenGame] = useState<GameState>()
  const onClick = (gv: GameView) => {
    const originalGame = hiddenGame ?? boardState.game
    const previewGame = new GameState({
      main: new Game({ moves: gv.moves }),
      gameid: gv.id,
      cursor: boardState.game.current.size,
    })
    if (!isPreviewMode) {
      setHiddenGame(boardState.game)
    }
    setBoardState(boardState.setGame(previewGame).setMode(BoardMode.preview))

    const onOpen = () => {
      setBoardState(new BoardState({ game: previewGame }))
      setHiddenGame(undefined)
      setConfirmState(undefined)
    }
    const onCancel = () => {
      setBoardState(boardState.setGame(originalGame).setMode(BoardMode.game))
      setHiddenGame(undefined)
      setConfirmState(undefined)
    }
    const confirmState = new ConfirmState({
      ok: new ConfirmOption({ text: 'Open', colorScheme: 'blue', onClick: onOpen }),
      cancel: new ConfirmOption({ text: 'Cancel', onClick: onCancel }),
    })
    setConfirmState(confirmState)
  }
  return (
    <Table size="rjn-info" variant="rjn-info">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Black</Th>
          <Th colSpan={3}>Result</Th>
          <Th>White</Th>
          <Th>Rule</Th>
          <Th>Op.</Th>
        </Tr>
      </Thead>
      <colgroup span={1} style={{ width: '20%' }} />
      <colgroup span={1} style={{ width: '25%' }} />
      <colgroup span={1} style={{ width: '2.5%' }} />
      <colgroup span={1} style={{ width: '5%' }} />
      <colgroup span={1} style={{ width: '2.5%' }} />
      <colgroup span={1} style={{ width: '25%' }} />
      <colgroup span={1} style={{ width: '10%' }} />
      <colgroup span={1} style={{ width: '10%' }} />
      <Tbody>
        {items.map((g, key) => {
          const mgid = isPreviewMode ? hiddenGame?.gameid : boardState.game.gameid
          const pgid = isPreviewMode ? boardState.game.gameid : undefined
          return (
            <Tr
              key={key}
              onClick={() => onClick(g)}
              bg={g.id === mgid ? 'green.100' : g.id === pgid ? 'purple.100' : undefined}
              _hover={{ bg: 'gray.100' }}
            >
              <Td isNumeric>{g.tournament.start}</Td>
              <Td>{playerShortName(g.black)}</Td>
              <Td>
                <WonIcon won={g.blackWon} />
              </Td>
              <Td>{g.moves.length.toString()}</Td>
              <Td>
                <WonIcon won={g.whiteWon} />
              </Td>
              <Td>{playerShortName(g.white)}</Td>
              <Td isNumeric>{ruleShortName(g.rule.name)}</Td>
              <Td isNumeric>{g.opening.abbr.toUpperCase()}</Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

export default Default

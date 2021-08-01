import {
  Center,
  Divider,
  Flex,
  SimpleGrid,
  Stack,
  Stat,
  StatHelpText,
  StatLabel,
  StatNumber,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { calcStat, calcStatByNextMove, GamesStat } from '../../../analysis'
import { GameView, RIFDatabase } from '../../../database'
import { encode, Point } from '../../../rule'
import { BoardMode } from '../../../state'
import { AdvancedContext, BasicContext } from '../../contexts'

const Default: FC = () => {
  const db = useMemo(() => new RIFDatabase(), [])
  const { searchQueryState, searchResultState } = useContext(AdvancedContext)
  const [games, setGames] = useState<GameView[]>([])
  useEffect(() => {
    ;(async () => setGames(await db.getGameViews(searchResultState.gameIds)))()
  }, [searchResultState.gameIds])
  const { moves, playerId } = searchQueryState.query
  if (moves !== undefined && playerId !== undefined) {
    return <StatsWithMovesAndPlayer games={games} moves={moves} playerId={playerId} />
  } else if (moves !== undefined && playerId === undefined) {
    return <StatsWithMoves games={games} moves={moves} />
  } else if (moves === undefined && playerId !== undefined) {
    return <StatsWithPlayer games={games} playerId={playerId} />
  } else {
    return <></>
  }
}

const StatsWithMovesAndPlayer: FC<{ games: GameView[]; moves: Point[]; playerId: number }> = ({
  games,
  moves,
  playerId,
}) => {
  const blackGames = games.filter(g => g.black.id === playerId)
  const whiteGames = games.filter(g => g.white.id === playerId)
  const blackStat = calcStat(blackGames)
  const whiteStat = calcStat(whiteGames)
  const blackStats = calcStatByNextMove(blackGames, moves).slice(0, 5)
  const whiteStats = calcStatByNextMove(whiteGames, moves).slice(0, 5)
  const denominator = Math.max(
    ...blackStats.map(([_, s]) => Math.max(s.blackWon, s.whiteWon, s.draw)),
    ...whiteStats.map(([_, s]) => Math.max(s.blackWon, s.whiteWon, s.draw))
  )
  return (
    <Stack width="100%" spacing="1rem" my="1rem">
      <StatComponent
        total={{ label: 'Play black', count: blackStat.all }}
        won={{ label: 'Won', count: blackStat.blackWon, color: 'blue.700' }}
        lost={{ label: 'Lost', count: blackStat.whiteWon, color: 'green.700' }}
        draw={{ label: 'Draw', count: blackStat.draw, color: 'gray.700' }}
      />
      <StatByNextMoveTable stats={blackStats} denominator={denominator} />
      <Divider />
      <StatComponent
        total={{ label: 'Play white', count: whiteStat.all }}
        won={{ label: 'Won', count: whiteStat.whiteWon, color: 'green.700' }}
        lost={{ label: 'Lost', count: whiteStat.blackWon, color: 'blue.700' }}
        draw={{ label: 'Draw', count: whiteStat.draw, color: 'gray.700' }}
      />
      <StatByNextMoveTable stats={whiteStats} denominator={denominator} isBlackRight />
    </Stack>
  )
}

const StatsWithMoves: FC<{ games: GameView[]; moves: Point[] }> = ({ games, moves }) => {
  const stat = calcStat(games)
  const stats = calcStatByNextMove(games, moves).slice(0, 10)
  const denominator = Math.max(...stats.map(([_, s]) => Math.max(s.blackWon, s.whiteWon, s.draw)))
  return (
    <Stack width="100%" spacing="1rem" my="1rem">
      <StatComponent
        total={{ label: 'All', count: stat.all }}
        won={{ label: 'Black won', count: stat.blackWon, color: 'blue.700' }}
        lost={{ label: 'White won', count: stat.whiteWon, color: 'green.700' }}
        draw={{ label: 'Draw', count: stat.draw, color: 'gray.700' }}
      />
      <StatByNextMoveTable stats={stats} denominator={denominator} />
    </Stack>
  )
}

const StatsWithPlayer: FC<{ games: GameView[]; playerId: number }> = ({ games, playerId }) => {
  const blackGames = games.filter(g => g.black.id === playerId)
  const whiteGames = games.filter(g => g.white.id === playerId)
  const blackStat = calcStat(blackGames)
  const whiteStat = calcStat(whiteGames)
  return (
    <Stack width="100%" spacing="1rem" my="1rem">
      <StatComponent
        total={{ label: 'Play black', count: blackStat.all }}
        won={{ label: 'Won', count: blackStat.blackWon, color: 'blue.700' }}
        lost={{ label: 'Lost', count: blackStat.whiteWon, color: 'green.700' }}
        draw={{ label: 'Draw', count: blackStat.draw, color: 'gray.700' }}
      />
      <Divider />
      <StatComponent
        total={{ label: 'Play white', count: whiteStat.all }}
        won={{ label: 'Won', count: whiteStat.whiteWon, color: 'green.700' }}
        lost={{ label: 'Lost', count: whiteStat.blackWon, color: 'blue.700' }}
        draw={{ label: 'Draw', count: whiteStat.draw, color: 'gray.700' }}
      />
    </Stack>
  )
}

type StatItemProps = {
  count: number
  label: string
  color?: string
}

type StatProps = {
  total: StatItemProps
  won: StatItemProps
  lost: StatItemProps
  draw: StatItemProps
}

const StatComponent: FC<StatProps> = ({ total, won, lost, draw }) => {
  return (
    <SimpleGrid columns={4} width="100%" textAlign="center">
      <Stat textColor={total.color}>
        <StatLabel>{total.label}</StatLabel>
        <StatNumber>{total.count}</StatNumber>
      </Stat>
      <Stat textColor={won.color}>
        <StatLabel>{won.label}</StatLabel>
        <StatNumber>{won.count}</StatNumber>
        <StatHelpText>{((100 * won.count) / total.count).toFixed(1)}%</StatHelpText>
      </Stat>
      <Stat textColor={lost.color}>
        <StatLabel>{lost.label}</StatLabel>
        <StatNumber>{lost.count}</StatNumber>
        <StatHelpText>{((100 * lost.count) / total.count).toFixed(1)}%</StatHelpText>
      </Stat>
      <Stat textColor={draw.color}>
        <StatLabel>{draw.label}</StatLabel>
        <StatNumber>{draw.count}</StatNumber>
        <StatHelpText>{((100 * draw.count) / total.count).toFixed(1)}%</StatHelpText>
      </Stat>
    </SimpleGrid>
  )
}

const StatByNextMoveTable: FC<{
  stats: [Point, GamesStat][]
  denominator: number
  isBlackRight?: boolean
}> = ({ stats, denominator, isBlackRight }) => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const onClick = (p: Point) => setBoardState(boardState.setMode(BoardMode.game).edit(p))
  return (
    <Table width="100%" size="rjn-info" variant="rjn-info">
      <Thead>
        <Tr>
          <Th>Move</Th>
          <Th>All</Th>
          <Th>{isBlackRight ? 'W. won' : 'B. won'}</Th>
          <Th>{isBlackRight ? 'B. won' : 'W. won'}</Th>
          <Th>Draw</Th>
        </Tr>
      </Thead>
      <colgroup span={1} style={{ width: '10%' }} />
      <colgroup span={1} style={{ width: '15%' }} />
      <colgroup span={1} style={{ width: '25%' }} />
      <colgroup span={1} style={{ width: '25%' }} />
      <colgroup span={1} style={{ width: '25%' }} />
      <Tbody>
        {stats.map(([p, s], key) => {
          const black = { color: 'blue.200', count: s.blackWon }
          const white = { color: 'green.200', count: s.whiteWon }
          const [won, lost] = isBlackRight ? [white, black] : [black, white]
          return (
            <Tr key={key} _hover={{ bg: 'gray.100' }} onClick={() => onClick(p)}>
              <Td isNumeric>{encode(p)}</Td>
              <Td isNumeric>{s.all}</Td>
              <Td isNumeric>
                {won.count !== 0 && (
                  <PercentileBar color={won.color} count={won.count} denominator={denominator} />
                )}
              </Td>
              <Td isNumeric>
                {lost.count !== 0 && (
                  <PercentileBar color={lost.color} count={lost.count} denominator={denominator} />
                )}
              </Td>
              <Td isNumeric>
                {s.draw !== 0 && (
                  <PercentileBar color="gray.200" count={s.draw} denominator={denominator} />
                )}
              </Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

const PercentileBar: FC<{ color: string; count: number; denominator: number }> = ({
  color,
  count,
  denominator,
}) => {
  return (
    <Center>
      <Flex
        backgroundColor={color}
        width={`${((100 * count) / denominator).toFixed()}%`}
        justify="center"
        overflowWrap="normal"
      >
        {count}
      </Flex>
    </Center>
  )
}

export default Default

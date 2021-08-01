import {
  Box,
  Center,
  Flex,
  SimpleGrid,
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
import { groupByNextMove } from '../../../analysis'
import { GameView, RIFDatabase } from '../../../database'
import { encode, Point } from '../../../rule'
import { BoardMode } from '../../../state'
import { AdvancedContext, BasicContext } from '../../contexts'

const Default: FC = () => {
  const db = useMemo(() => new RIFDatabase(), [])
  const { searchQueryState, searchResultState } = useContext(AdvancedContext)
  const [games, setGames] = useState<GameView[]>([])
  const { boardState, setBoardState } = useContext(BasicContext)
  useEffect(() => {
    const gameCount = searchResultState.gameIds.length
    if (gameCount === 0) {
      setGames([])
      return
    }
    ;(async () => setGames(await db.getGameViews(searchResultState.gameIds)))()
  }, [searchResultState.gameIds])
  const queryMoves = searchQueryState.query.moves
  if (queryMoves === undefined) return <></>

  const totalStat = calcStat(games)
  const statByNextMove = calcStatByNextMove(games, queryMoves).slice(0, 10)
  const maxCount = Math.max(
    ...statByNextMove.map(([p, s]) => Math.max(s.blackWon, s.whiteWon, s.draw))
  )
  const onClick = (point: Point) => setBoardState(boardState.setMode(BoardMode.game).edit(point))
  return (
    <>
      <SimpleGrid columns={4} width="100%" textAlign="center">
        <Stat>
          <StatLabel>All</StatLabel>
          <StatNumber>{totalStat.all}</StatNumber>
        </Stat>
        <Stat textColor="blue.700">
          <StatLabel>Black&nbsp;won</StatLabel>
          <StatNumber>{totalStat.blackWon}</StatNumber>
          <StatHelpText>{((100 * totalStat.blackWon) / totalStat.all).toFixed(1)}%</StatHelpText>
        </Stat>
        <Stat textColor="green.700">
          <StatLabel>White&nbsp;won</StatLabel>
          <StatNumber>{totalStat.whiteWon}</StatNumber>
          <StatHelpText>{((100 * totalStat.whiteWon) / totalStat.all).toFixed(1)}%</StatHelpText>
        </Stat>
        <Stat textColor="gray.700">
          <StatLabel>Draw</StatLabel>
          <StatNumber>{totalStat.draw}</StatNumber>
          <StatHelpText>{((100 * totalStat.draw) / totalStat.all).toFixed(1)}%</StatHelpText>
        </Stat>
      </SimpleGrid>
      <Box width="100%">
        <Table size="rjn-info" variant="rjn-info">
          <Thead>
            <Tr>
              <Th>Move</Th>
              <Th>All</Th>
              <Th>B.&nbsp;won</Th>
              <Th>W.&nbsp;won</Th>
              <Th>Draw</Th>
            </Tr>
          </Thead>
          <colgroup span={1} style={{ width: '10%' }} />
          <colgroup span={1} style={{ width: '15%' }} />
          <colgroup span={1} style={{ width: '25%' }} />
          <colgroup span={1} style={{ width: '25%' }} />
          <colgroup span={1} style={{ width: '25%' }} />
          <Tbody>
            {statByNextMove.map(([point, stat], key) => {
              return (
                <Tr key={key} _hover={{ bg: 'gray.100' }} onClick={() => onClick(point)}>
                  <Td isNumeric>{encode(point)}</Td>
                  <Td isNumeric>{stat.all}</Td>
                  <Td isNumeric>
                    {stat.blackWon !== 0 && (
                      <Center>
                        <Flex
                          backgroundColor="blue.200"
                          width={`${((100 * stat.blackWon) / maxCount).toFixed()}%`}
                          justify="center"
                          overflowWrap="normal"
                        >
                          {stat.blackWon}
                        </Flex>
                      </Center>
                    )}
                  </Td>
                  <Td isNumeric>
                    {stat.whiteWon !== 0 && (
                      <Center>
                        <Flex
                          backgroundColor="green.200"
                          width={`${((100 * stat.whiteWon) / maxCount).toFixed()}%`}
                          justify="center"
                          overflowWrap="normal"
                        >
                          {stat.whiteWon}
                        </Flex>
                      </Center>
                    )}
                  </Td>
                  <Td isNumeric>
                    {stat.draw !== 0 && (
                      <Center>
                        <Flex
                          backgroundColor="gray.200"
                          width={`${((100 * stat.draw) / maxCount).toFixed()}%`}
                          justify="center"
                          overflowWrap="normal"
                        >
                          {stat.draw}
                        </Flex>
                      </Center>
                    )}
                  </Td>
                </Tr>
              )
            })}
          </Tbody>
        </Table>
      </Box>
    </>
  )
}

type GamesStat = {
  all: number
  blackWon: number
  whiteWon: number
  draw: number
}

const calcStat = (games: GameView[]): GamesStat => {
  let blackWon = 0
  let whiteWon = 0
  let draw = 0
  for (const game of games) {
    if (game.blackWon) {
      blackWon += 1
    } else if (game.whiteWon) {
      whiteWon += 1
    } else {
      draw += 1
    }
  }
  return { all: games.length, blackWon, whiteWon, draw }
}

const calcStatByNextMove = (games: GameView[], queryMoves: Point[]): [Point, GamesStat][] => {
  const queryLength = queryMoves.length
  const movesDataset = games.map(game => game.moves.slice(0, queryLength + 1))
  const groups = groupByNextMove(queryMoves, movesDataset)
  const stats: [Point, GamesStat][] = groups.map(([point, indices]) => {
    const groupGames = indices.map(i => games[i])
    const stat = calcStat(groupGames)
    return [point, stat]
  })
  return stats.sort((a, b) => b[1].all - a[1].all)
}

export default Default

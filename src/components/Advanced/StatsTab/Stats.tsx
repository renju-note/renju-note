import {
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
  return (
    <>
      <StatComponent stat={totalStat} />
      <StatByNextMoveTable stats={statByNextMove} />
    </>
  )
}

const StatComponent: FC<{ stat: GamesStat }> = ({ stat }) => {
  return (
    <SimpleGrid columns={4} width="100%" textAlign="center">
      <Stat>
        <StatLabel>All</StatLabel>
        <StatNumber>{stat.all}</StatNumber>
      </Stat>
      <Stat textColor="blue.700">
        <StatLabel>Black&nbsp;won</StatLabel>
        <StatNumber>{stat.blackWon}</StatNumber>
        <StatHelpText>{((100 * stat.blackWon) / stat.all).toFixed(1)}%</StatHelpText>
      </Stat>
      <Stat textColor="green.700">
        <StatLabel>White&nbsp;won</StatLabel>
        <StatNumber>{stat.whiteWon}</StatNumber>
        <StatHelpText>{((100 * stat.whiteWon) / stat.all).toFixed(1)}%</StatHelpText>
      </Stat>
      <Stat textColor="gray.700">
        <StatLabel>Draw</StatLabel>
        <StatNumber>{stat.draw}</StatNumber>
        <StatHelpText>{((100 * stat.draw) / stat.all).toFixed(1)}%</StatHelpText>
      </Stat>
    </SimpleGrid>
  )
}

const StatByNextMoveTable: FC<{ stats: [Point, GamesStat][] }> = ({ stats }) => {
  const { boardState, setBoardState } = useContext(BasicContext)
  const onClick = (point: Point) => setBoardState(boardState.setMode(BoardMode.game).edit(point))
  const denominator = Math.max(...stats.map(([p, s]) => Math.max(s.blackWon, s.whiteWon, s.draw)))
  return (
    <Table width="100%" size="rjn-info" variant="rjn-info">
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
        {stats.map(([point, stat], key) => (
          <Tr key={key} _hover={{ bg: 'gray.100' }} onClick={() => onClick(point)}>
            <Td isNumeric>{encode(point)}</Td>
            <Td isNumeric>{stat.all}</Td>
            <Td isNumeric>
              {stat.blackWon !== 0 && (
                <PercentileBar color="blue.200" count={stat.blackWon} denominator={denominator} />
              )}
            </Td>
            <Td isNumeric>
              {stat.whiteWon !== 0 && (
                <PercentileBar color="green.200" count={stat.whiteWon} denominator={denominator} />
              )}
            </Td>
            <Td isNumeric>
              {stat.draw !== 0 && (
                <PercentileBar color="gray.200" count={stat.draw} denominator={denominator} />
              )}
            </Td>
          </Tr>
        ))}
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

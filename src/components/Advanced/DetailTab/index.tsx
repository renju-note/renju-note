import {
  Box,
  Button,
  Center,
  Heading,
  Link,
  Stack,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Tr,
  Wrap,
  WrapItem,
} from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { GameView, RIFCity, RIFCountry, RIFDatabase, RIFPlayer } from '../../../database'
import { TabName } from '../../../state'
import { AdvancedContext, BasicContext } from '../../contexts'
import { WonIcon } from '../common'

const Default: FC = () => {
  const db = useMemo(() => new RIFDatabase(), [])
  const [countriesMap, setCountriesMap] = useState<Map<RIFCountry['id'], RIFCountry>>(new Map())
  const [citiesMap, setCitiesMap] = useState<Map<RIFCity['id'], RIFCity>>(new Map())
  useEffect(() => {
    ;(async () => {
      setCountriesMap(await db.getCountriesMap())
      setCitiesMap(await db.getCitiesMap())
    })()
  }, [])

  const { boardState } = useContext(BasicContext)
  const gid = boardState.game.gameid
  const [gameView, setGameView] = useState<GameView>()
  useEffect(() => {
    if (gid === undefined) {
      setGameView(undefined)
      return
    }
    ;(async () => {
      const result = await db.getGameViews([gid])
      if (result.length > 0) setGameView(result[0])
    })()
  }, [gid])

  if (gameView === undefined) {
    return (
      <Center>
        <Text color="gray.600" my="1rem">
          No game is selected
        </Text>
      </Center>
    )
  }
  const { black, white, tournament, rule, publisher } = gameView
  const url = `https://www.renju.net/media/games.php?gameid=${gameView.id}`
  return (
    <Stack fontFamily="Noto Serif">
      <Heading as="h2" size="sm">
        Game
      </Heading>
      <Wrap pl="1rem">
        <WrapItem width="25%" minWidth="120px">
          <Table size="rjn-info" variant="rjn-info">
            <colgroup span={1} style={{ width: '25%' }} />
            <colgroup span={1} style={{ width: '25%' }} />
            <colgroup span={1} style={{ width: '50%' }} />
            <Tbody>
              <Tr>
                <Th>Black</Th>
                <Td>
                  <WonIcon won={gameView.blackWon} />
                </Td>
                <Td isNumeric>{gameView.btime || '?'} min</Td>
              </Tr>
              <Tr>
                <Th>White</Th>
                <Td>
                  <WonIcon won={gameView.whiteWon} />
                </Td>
                <Td isNumeric>{gameView.wtime || '?'} min</Td>
              </Tr>
            </Tbody>
          </Table>
        </WrapItem>
        <WrapItem width="20%" minWidth="120px">
          <Table size="rjn-info" variant="rjn-info">
            <colgroup span={1} style={{ width: '25%' }} />
            <colgroup span={1} style={{ width: '75%' }} />
            <Tbody>
              <Tr>
                <Th>Rule</Th>
                <Td isNumeric>{rule.name}</Td>
              </Tr>
              <Tr>
                <Th>Swap</Th>
                <Td isNumeric>{gameView.swap}</Td>
              </Tr>
            </Tbody>
          </Table>
        </WrapItem>
        <WrapItem width="30%" minWidth="240px">
          <Table size="rjn-info" variant="rjn-info">
            <colgroup span={1} style={{ width: '15%' }} />
            <colgroup span={1} style={{ width: '85%' }} />
            <Tbody>
              <Tr>
                <Th>Alt</Th>
                <Td isNumeric>{gameView.alt}</Td>
              </Tr>
              <Tr>
                <Th>Info</Th>
                <Td isNumeric>{gameView.info}</Td>
              </Tr>
            </Tbody>
          </Table>
        </WrapItem>
      </Wrap>

      <Heading as="h2" size="sm">
        Black Player
      </Heading>
      <Box pl="1rem">
        <Player player={black} countriesMap={countriesMap} />
      </Box>

      <Heading as="h2" size="sm">
        White Player
      </Heading>
      <Box pl="1rem">
        <Player player={white} countriesMap={countriesMap} />
      </Box>

      <Heading as="h2" size="sm">
        Tournament
      </Heading>
      <Box pl="1rem">
        <Text>
          {!tournament.rated && '(Unrated)'} {`${tournament.name.trim()}`}
          <br />
          {`${tournament.start} - ${tournament.end}`}
          &emsp;
          {citiesMap.get(tournament.city)?.name}, {countriesMap.get(tournament.country)?.name}
          <br />
          Round {gameView.round}
        </Text>
      </Box>

      <Heading as="h2" size="sm">
        Publisher
      </Heading>
      <Box pl="1rem">
        <Player player={publisher} countriesMap={countriesMap} />
      </Box>

      <Heading as="h2" size="sm">
        Generated Link
      </Heading>
      <Box pl="1rem">
        <Link href={url} isExternal color="teal.500" fontFamily="Roboto">
          {url}
        </Link>
      </Box>
    </Stack>
  )
}

const Player: FC<{ player: RIFPlayer; countriesMap: Map<number, RIFCountry> }> = ({
  player,
  countriesMap,
}) => {
  const { searchQueryState, setSearchQueryState, tabsState, setTabsState } =
    useContext(AdvancedContext)
  const onClick = () => {
    setSearchQueryState(searchQueryState.setPlayerId(player.id))
    setTabsState(tabsState.setCurrent(TabName.search))
  }
  return (
    <Text>
      <Button
        variant="link"
        onClick={onClick}
      >{`${player.name.trim()} ${player.surname.trim()}`}</Button>
      <br />
      {countriesMap.get(player.country)?.name}
    </Text>
  )
}

export default Default

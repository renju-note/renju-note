import { Box, Button, Heading, Link, Stack, Text } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { GameView, RIFCity, RIFCountry, RIFDatabase, RIFPlayer } from '../../../../database'
import { TabName } from '../../../../state'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../../contexts'
import { WonIcon } from '../common'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const db = useMemo(() => new RIFDatabase(), [])
  const [countriesMap, setCountriesMap] = useState<Map<RIFCountry['id'], RIFCountry>>(new Map())
  const [citiesMap, setCitiesMap] = useState<Map<RIFCity['id'], RIFCity>>(new Map())
  useEffect(() => {
    ;(async () => {
      setCountriesMap(await db.getCountriesMap())
      setCitiesMap(await db.getCitiesMap())
    })()
  }, [])

  const { boardState } = useContext(BoardStateContext)
  const gid = boardState.mainGame.gameid
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
      <Stack justify="center" align="center">
        <Text color="gray.600" my="1rem">
          No game is selected
        </Text>
      </Stack>
    )
  }
  const { black, white, tournament, rule, publisher } = gameView
  const url = `https://www.renju.net/media/games.php?gameid=${gameView.id}`
  return (
    <Stack px="1rem" fontFamily="Noto Serif" color="gray.800">
      <Heading as="h2" size="sm">
        Game
      </Heading>
      <Stack pl="1rem" isInline>
        <Box width={(system.W * 4) / 16}>
          <table className="detail-game">
            <colgroup span={1} style={{ width: (system.W * 1) / 16 }} />
            <colgroup span={1} style={{ width: (system.W * 1) / 16 }} />
            <colgroup span={1} style={{ width: (system.W * 2) / 16 }} />
            <tbody>
              <tr>
                <th>Black</th>
                <td>
                  <WonIcon won={gameView.blackWon} />
                </td>
                <td>{gameView.btime || '?'} min</td>
              </tr>
              <tr>
                <th>White</th>
                <td>
                  <WonIcon won={gameView.whiteWon} />
                </td>
                <td>{gameView.wtime || '?'} min</td>
              </tr>
            </tbody>
          </table>
        </Box>
        <Box width={(system.W * 10) / 16}>
          <table className="detail-game">
            <colgroup span={1} style={{ width: (system.W * 1) / 16 }} />
            <colgroup span={1} style={{ width: (system.W * 3) / 16 }} />
            <colgroup span={1} style={{ width: (system.W * 1) / 16 }} />
            <colgroup span={1} style={{ width: (system.W * 5) / 16 }} />
            <tbody>
              <tr>
                <th>Rule</th>
                <td>{rule.name}</td>
                <th>Alt</th>
                <td>{gameView.alt}</td>
              </tr>
              <tr>
                <th>Swap</th>
                <td>{gameView.swap}</td>
                <th>Info</th>
                <td>{gameView.info}</td>
              </tr>
            </tbody>
          </table>
        </Box>
      </Stack>

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
      <Text pl="1rem">
        {!tournament.rated && '(Unrated)'} {`${tournament.name.trim()}`}
        <br />
        {`${tournament.start} - ${tournament.end}`}
        &emsp;
        {citiesMap.get(tournament.city)?.name}, {countriesMap.get(tournament.country)?.name}
        <br />
        Round {gameView.round}
      </Text>

      <Heading as="h2" size="sm">
        Publisher
      </Heading>
      <Box pl="1rem">
        <Player player={publisher} countriesMap={countriesMap} />
      </Box>

      <Heading as="h2" size="sm">
        Generated Link
      </Heading>

      <Text pl="1rem">
        <Link href={url} isExternal color="teal.500" fontFamily="Roboto">
          {url}
        </Link>
      </Text>
    </Stack>
  )
}

const Player: FC<{ player: RIFPlayer; countriesMap: Map<number, RIFCountry> }> = ({
  player,
  countriesMap,
}) => {
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  const onClick = () => {
    setAdvancedState(advancedState.setSearchPlayerId(player.id).setTab(TabName.search))
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

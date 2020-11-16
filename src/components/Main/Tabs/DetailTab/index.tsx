import { Heading, Link, Stack, Text } from '@chakra-ui/react'
import React, { FC, useContext } from 'react'
import { GameViewContext } from '../contexts'

const Default: FC = () => {
  const { gameView } = useContext(GameViewContext)
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
        Black
      </Heading>
      <Text pl="1rem">{`${black.name.trim()} ${black.surname.trim()}`}</Text>

      <Heading as="h2" size="sm">
        White
      </Heading>
      <Text pl="1rem">{`${white.name.trim()} ${white.surname.trim()}`}</Text>

      <Heading as="h2" size="sm">
        Tournament
      </Heading>
      <Text pl="1rem">
        {!tournament.rated && '(Unrated)'} {`${tournament.name.trim()}`}
        <br />
        {`${tournament.start} - ${tournament.end}`}
      </Text>

      <Heading as="h2" size="sm">
        Rule
      </Heading>
      <Text pl="1rem">{rule.name}</Text>

      <Heading as="h2" size="sm">
        Publisher
      </Heading>
      <Text pl="1rem">{`${publisher.name.trim()} ${publisher.surname.trim()}`}</Text>

      <Heading as="h2" size="sm">
        Link
      </Heading>

      <Text pl="1rem">
        <Link href={url} isExternal color="teal.500" fontFamily="Roboto">
          {url}
        </Link>
      </Text>
    </Stack>
  )
}

export default Default

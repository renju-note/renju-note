import { Box, Center, Stack, Text } from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { AnalyzedDatabase } from '../../../database'
import { Point } from '../../../rule'
import { AdvancedContext } from '../../contexts'
import GamesPager from './GamesPager'
import GamesTable from './GamesTable'
import SearchController from './SearchController'

const Default: FC = () => {
  const db = useMemo(() => new AnalyzedDatabase(), [])
  const { searchState, setSearchState } = useContext(AdvancedContext)
  const queryMoves = searchState.queryMoves
  const queryPlayerId = searchState.queryPlayerId
  const [error, setError] = useState<string | undefined>()
  const onSearch = async (query: {
    moves?: Point[]
    playerId?: number
    limit: number
    offset: number
  }) => {
    // TODO: error when game is inverted
    const { hit, ids, error } = await db.search({
      moves: query.moves,
      playerId: query.playerId,
      limit: query.limit,
      offset: query.offset,
    })
    setSearchState(searchState.setResult(hit, ids))
    setError(error)
  }
  useEffect(() => {
    onSearch({
      moves: queryMoves,
      playerId: queryPlayerId,
      limit: searchState.queryLimit,
      offset: searchState.queryOffset,
    })
  }, [queryMoves?.length, queryPlayerId, searchState.pager.page])
  return (
    <Stack justify="center" align="center">
      <Box width="100%">
        <SearchController />
      </Box>
      {error && (
        <Text color="gray.600" py="1rem">
          {error}
        </Text>
      )}
      {searchState.result.length > 0 && (
        <Center>
          <GamesPager />
        </Center>
      )}
      {searchState.result.length > 0 && (
        <Box width="100%">
          <GamesTable />
        </Box>
      )}
    </Stack>
  )
}

export default Default

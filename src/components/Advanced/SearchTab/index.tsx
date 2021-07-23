import { Box, Center, Stack, Text } from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { AnalyzedDatabase } from '../../../database'
import { AdvancedContext } from '../../contexts'
import GamesPager from './GamesPager'
import GamesTable from './GamesTable'
import SearchController from './SearchController'

const Default: FC = () => {
  const db = useMemo(() => new AnalyzedDatabase(), [])
  const { searchState, setSearchState } = useContext(AdvancedContext)
  const [error, setError] = useState<string | undefined>()
  useEffect(() => {
    console.log('search')
    ;(async () => {
      const { hit, ids, error } = await db.search({
        moves: searchState.queryMoves,
        playerId: searchState.queryPlayerId,
        limit: searchState.queryLimit,
        offset: 0,
      })
      setSearchState(searchState.setHitAndResult(hit, ids))
      setError(error)
    })()
  }, [searchState.queryMoves?.length, searchState.queryPlayerId, searchState.queryLimit])
  useEffect(() => {
    console.log('page')
    ;(async () => {
      const { ids, error } = await db.search({
        moves: searchState.queryMoves,
        playerId: searchState.queryPlayerId,
        limit: searchState.queryLimit,
        offset: searchState.queryOffset,
      })
      setSearchState(searchState.setResult(ids))
      setError(error)
    })()
  }, [searchState.queryOffset])
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

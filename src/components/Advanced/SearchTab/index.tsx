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
  const query = searchState.query
  const [error, setError] = useState<string | undefined>()
  useEffect(() => {
    console.log('search')
    ;(async () => {
      const { hit, ids, error } = await db.search(query)
      setSearchState(searchState.setHitAndResult(hit, ids))
      setError(error)
    })()
  }, [query.moves?.toString(), query.playerId, query.limit, query.offset])
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

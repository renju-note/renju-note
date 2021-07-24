import { Box, Stack, Text } from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo } from 'react'
import { AnalyzedDatabase } from '../../../database'
import { AdvancedContext } from '../../contexts'
import SearchController from '../common/SearchController'
import GamesSelector from './GamesSelector'

const Default: FC = () => {
  const db = useMemo(() => new AnalyzedDatabase(), [])
  const { searchState, setSearchState } = useContext(AdvancedContext)
  const query = searchState.query
  useEffect(() => {
    ;(async () => {
      const { hit, ids, error } = await db.search(query)
      setSearchState(searchState.setResult(hit, ids, error))
    })()
  }, [query.moves?.toString(), query.playerId, query.limit, query.offset])
  return (
    <Stack justify="center" align="center">
      <Box width="100%">
        <SearchController />
      </Box>
      {searchState.error && (
        <Text color="gray.600" py="1rem">
          {searchState.error}
        </Text>
      )}
      {searchState.gameIds.length > 0 && <GamesSelector />}
    </Stack>
  )
}

export default Default

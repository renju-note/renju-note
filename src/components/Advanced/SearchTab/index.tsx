import { Box, Stack, Text } from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo } from 'react'
import { AnalyzedDatabase } from '../../../database'
import { SearchResultState } from '../../../state'
import { AdvancedContext } from '../../contexts'
import SearchController from '../common/SearchController'
import GamesSelector from './GamesSelector'

const Default: FC = () => {
  const db = useMemo(() => new AnalyzedDatabase(), [])
  const { searchQueryState, searchResultState, setSearchResultState } = useContext(AdvancedContext)
  const query = searchQueryState.query
  useEffect(() => {
    ;(async () => {
      const { hit, ids, error } = await db.search(query)
      setSearchResultState(new SearchResultState({ hit, gameIds: ids, error }))
    })()
  }, [query.moves?.toString(), query.playerId])
  return (
    <Stack justify="center" align="center">
      <Box width="100%">
        <SearchController />
      </Box>
      {searchResultState.error && (
        <Text color="gray.600" py="1rem">
          {searchResultState.error}
        </Text>
      )}
      {searchResultState.gameIds.length > 0 && <GamesSelector />}
    </Stack>
  )
}

export default Default

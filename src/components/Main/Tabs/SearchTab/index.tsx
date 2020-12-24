import { Box, Stack, Text } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { AnalyzedDatabase } from '../../../../database'
import { Point } from '../../../../rule'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../../contexts'
import GamesPager from './GamesPager'
import GamesTable from './GamesTable'
import SearchController from './SearchController'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const { gameState } = useContext(BoardStateContext)
  const { advancedState } = useContext(AdvancedStateContext)
  const analyzedDB = useMemo(() => new AnalyzedDatabase(), [])
  const pageSize = system.seachPageSize

  const [page, setPage] = useState<number>(0)
  const [ids, setIds] = useState<number[]>([])
  const [hit, setHit] = useState<number>(0)
  const [error, setError] = useState<string | undefined>()
  const onSearch = async (moves?: Point[], playerId?: number) => {
    const { ids, hit, error } = await analyzedDB.search({
      moves,
      playerId,
      limit: pageSize,
      offset: page * pageSize,
    })
    setIds(ids)
    setHit(hit)
    setError(error)
  }
  useEffect(() => {
    onSearch(gameState.current.moves, advancedState.playerId)
  }, [gameState.current.size, advancedState.playerId, page])
  return (
    <Stack justify="center" align="center">
      <Box>
        <SearchController />
      </Box>
      {error && (
        <Text color="gray.600" py="1rem">
          {error}
        </Text>
      )}
      {ids.length > 0 && (
        <Box>
          <GamesPager page={page} setPage={setPage} hit={hit} pageSize={pageSize} />
        </Box>
      )}
      {ids.length > 0 && (
        <Box>
          <GamesTable gameIds={ids} />
        </Box>
      )}
    </Stack>
  )
}

export default Default

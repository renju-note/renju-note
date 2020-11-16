import { Box, Stack, Text } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { AnalyzedDatabase, ready } from '../../../../database'
import { Point } from '../../../../rule'
import { BoardStateContext, SystemContext } from '../../../contexts'
import GamesPager from './GamesPager'
import GamesTable from './GamesTable'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [databaseReady, setDatabaseReady] = useState<boolean>(false)
  useEffect(() => {
    ;(async () => setDatabaseReady(await ready()))()
  }, [])
  const { boardState } = useContext(BoardStateContext)
  const analyzedDB = useMemo(() => new AnalyzedDatabase(), [])

  const pageSize = system.seachPageSize
  const [page, setPage] = useState<number>(0)

  const [ids, setIds] = useState<number[]>([])
  const [hit, setHit] = useState<number>(0)
  const [error, setError] = useState<string | undefined>()

  const onSearch = async (moves: Point[]) => {
    const { ids, hit, error } = await analyzedDB.search(moves, pageSize, page * pageSize)
    setIds(ids)
    setHit(hit)
    setError(error)
  }
  useEffect(() => {
    onSearch(boardState.game.moves)
  }, [boardState.game.size, page])

  if (!databaseReady) {
    return (
      <Stack justify="center" align="center">
        <Text color="gray.600" my="1rem">
          Database is not ready
        </Text>
      </Stack>
    )
  }

  return (
    <Stack justify="center" align="center">
      {error && (
        <Text color="gray.600" my="1rem">
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

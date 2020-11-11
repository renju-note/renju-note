import { Box, Stack, Text } from '@chakra-ui/core'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { AnalyzedDatabase } from '../../../../database'
import { Point } from '../../../../rule'
import { AppStateContext, SystemContext } from '../../../contexts'
import GamesPager from './GamesPager'
import GamesTable from './GamesTable'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const appState = useContext(AppStateContext)[0]
  const analyzedDB = useMemo(() => new AnalyzedDatabase(), [])

  const pageSize = system.seachPageSize
  const [page, setPage] = useState<number>(0)

  const [ids, setIds] = useState<number[]>([])
  const [hit, setHit] = useState<number>(0)
  const [error, setError] = useState<string | undefined>()

  const onSearch = async (moves: Point[]) => {
    const { ids, hit, error } = await analyzedDB.search(
      moves,
      pageSize,
      page * pageSize,
    )
    setIds(ids)
    setHit(hit)
    setError(error)
  }
  useEffect(
    () => {
      onSearch(appState.moves)
    },
    [appState.moves.length, page]
  )
  return <Stack width={system.W} justify="center" align="center" spacing="1rem">
    {
      error &&
      <Text color="gray.600" my="1rem">{error}</Text>
    }
    {
      ids.length > 0 &&
      <Box>
        <GamesPager
          page={page}
          setPage={setPage}
          hit={hit}
          pageSize={pageSize}
        />
      </Box>
    }
    {
      ids.length > 0 &&
      <Box>
        <GamesTable gameIds={ids} />
      </Box>
    }
  </Stack>
}

export default Default

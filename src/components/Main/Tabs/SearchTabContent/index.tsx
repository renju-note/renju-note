import { Box, Button, ButtonGroup, IconButton, Stack } from '@chakra-ui/core'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import { RiArrowDownLine, RiArrowUpLine } from 'react-icons/ri'
import { AnalyzedDatabase, GameView, RIFDatabase } from '../../../../database'
import { Point } from '../../../../rule'
import { AppStateContext, SystemContext } from '../../../contexts'
import GameViewsTable from './GameViewsTable'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const appState = useContext(AppStateContext)[0]

  const [gameViews, setGameViews] = useState<GameView[]>([])
  const [reverse, setReverse] = useState<boolean>(true)
  const [page, setPage] = useState<number>(0)

  const rifDB = useMemo(() => new RIFDatabase(), [])
  const analyzedDB = useMemo(() => new AnalyzedDatabase(), [])

  const onSearch = async (moves: Point[]) => {
    const ids = await analyzedDB.search(
      moves,
      system.seachPageSize,
      page * system.seachPageSize,
      reverse,
    )
    if (ids.length === 0) {
      setGameViews([])
      return
    }
    const gameViews = await rifDB.getGameViews(ids)
    setGameViews(gameViews)
  }

  useEffect(
    () => {
      onSearch(appState.moves)
    },
    [appState.moves.length, page, reverse]
  )

  return <Stack width={system.W} justify="center" align="center" spacing="1rem">
    <Box>
      <IconButton
        size="sm"
        icon={reverse ? RiArrowDownLine : RiArrowUpLine }
        aria-label="reverse"
        onClick={() => setReverse(!reverse)}
      />

    </Box>
    <Box>
      <GameViewsTable items={gameViews} />
    </Box>
    <Box>
      <Pager
        page={page}
        setPage={setPage}
        lastPage={10}
        sizePerPage={system.seachPageSize} />
    </Box>
  </Stack>
}

type PagerProps = {
  page: number
  setPage: (page: number) => void
  lastPage: number
  sizePerPage: number
}

const Pager: FC<PagerProps> = ({
  page,
  setPage,
  lastPage,
  sizePerPage,
}) => {
  const system = useContext(SystemContext)
  return <ButtonGroup spacing={1} size={system.buttonSizeSmaller} variant="outline">
    <IconButton
      aria-label="first"
      icon={FiChevronsLeft}
      isDisabled={page <= 0}
      onClick={() => setPage(0)}
    />
    <IconButton
      aria-label="prev"
      icon={FiChevronLeft}
      isDisabled={page <= 0}
      onClick={() => setPage(Math.max(0, page - 1))}
    />
    <Button isDisabled variant="ghost" width={`${system.W / 8}px`}>
      {`${page * sizePerPage + 1} - ${(page + 1) * sizePerPage}`}
    </Button>
    <IconButton
      aria-label="next"
      icon={FiChevronRight}
      isDisabled={page >= lastPage}
      onClick={() => setPage(Math.min(lastPage, page + 1))}
    />
    <IconButton
      aria-label="last"
      icon={FiChevronsRight}
      isDisabled={page >= lastPage}
      onClick={() => setPage(lastPage)}
    />
  </ButtonGroup>
}

export default Default

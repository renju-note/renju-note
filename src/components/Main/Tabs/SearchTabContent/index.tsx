import { IconButton, Stack } from '@chakra-ui/core'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
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

  const rifDB = useMemo(() => new RIFDatabase(), [])
  const analyzedDB = useMemo(() => new AnalyzedDatabase(), [])

  const onSearch = async (blacks: Point[], whites: Point[]) => {
    const ids = await analyzedDB.search([blacks, whites], 20, 0, reverse)
    if (ids.length === 0) {
      setGameViews([])
      return
    }
    const gameViews = await rifDB.getGameViews(ids)
    setGameViews(gameViews)
  }

  useEffect(
    () => {
      onSearch(appState.blacks, appState.whites)
    },
    [appState.blacks.length + appState.whites.length, reverse]
  )

  return <Stack width={system.W} justify="center" align="center">
    <IconButton
      size="sm"
      icon={reverse ? RiArrowDownLine : RiArrowUpLine }
      aria-label="reverse"
      onClick={() => setReverse(!reverse)}
    />
    <GameViewsTable items={gameViews} />
  </Stack>
}

export default Default

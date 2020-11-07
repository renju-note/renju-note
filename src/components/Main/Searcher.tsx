import { Flex, Icon, IconButton } from '@chakra-ui/core'
import React, { FC, useContext, useEffect, useState } from 'react'
import { RiCheckboxCircleFill, RiCloseLine, RiPlayFill, RiSubtractFill } from 'react-icons/ri'
import { AnalyzedDatabase, GameView, RIFDatabase } from '../../database'
import { Game, Point } from '../../rule'
import { AppStateContext, SystemContext } from '../contexts'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const appState = useContext(AppStateContext)[0]
  const [gameViews, setGameViews] = useState<GameView[]>([])
  const onSearch = async (blacks: Point[], whites: Point[]) => {
    const analyzed = new AnalyzedDatabase()
    const db = new RIFDatabase()
    const ids = await analyzed.search([blacks, whites], 10, 0)
    if (ids.length === 0) return
    const gameViews = await db.getGameViews(ids)
    setGameViews(gameViews)
  }
  useEffect(
    () => {
      onSearch(appState.blacks, appState.whites)
    },
    [appState.blacks.length + appState.whites.length]
  )
  return <Flex width={system.W} justify="center" align="center">
    <GamesTable gameViews={gameViews} />
  </Flex>
}

const GamesTable: FC<{gameViews: GameView[]}> = ({
  gameViews,
}) => {
  const system = useContext(SystemContext)
  const [appState, setAppstate] = useContext(AppStateContext)
  const onGameViewClick = (gv: GameView) => {
    const game = Game.fromCode(gv.move)
    if (!game) return
    setAppstate(appState.setGame(game))
  }
  return <table>
    <colgroup span={1} style={{ width: system.W / 8 }} />
    <colgroup span={1} style={{ width: system.W / 4 }} />
    <colgroup span={1} style={{ width: system.W / 32 }} />
    <colgroup span={1} style={{ width: system.W / 16 }} />
    <colgroup span={1} style={{ width: system.W / 32 }} />
    <colgroup span={1} style={{ width: system.W / 4 }} />
    <colgroup span={1} style={{ width: system.W / 8 }} />
    <tbody>
      {
        gameViews.map((g, key) => {
          return <tr
            key={key}
          >
            <td>
            </td>
            <td style={{ textAlign: 'center' }}><u>{g.blackShortName}</u></td>
            <td style={{ textAlign: 'center' }}><WonIcon won={g.blackWon} /></td>
            <td></td>
            <td style={{ textAlign: 'center' }}><WonIcon won={g.whiteWon} /></td>
            <td style={{ textAlign: 'center' }}>{g.whiteShortName}</td>
            <td style={{ textAlign: 'right' }}>
              <IconButton
                onClick={() => onGameViewClick(g)}
                size="xs" icon={RiPlayFill} aria-label="play"
              />
            </td>
          </tr>
        })
      }
    </tbody>
  </table>
}

const WonIcon: FC<{won: boolean | null }> = ({
  won,
}) => {
  switch (won) {
    case true:
      return <Icon as={RiCheckboxCircleFill} size="small" color="green.500" />
    case false:
      return <Icon as={RiCloseLine} size="small" color="gray.500" />
    case null:
      return <Icon as={RiSubtractFill} size="small" color="gray.500" />
    default:
      return <></>
  }
}

export default Default

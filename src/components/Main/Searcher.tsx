import React, { FC, useContext, useState, useEffect } from 'react'
import { Input, Button, Flex, Stack, IconButton, Icon } from '@chakra-ui/core'
import { RIFDatabase, AnalyzedDatabase, GameView } from '../../database'
import { AppStateContext, SystemContext } from '../contexts'
import { Game, Point } from '../../rule'
import { RiCheckboxCircleFill, RiSubtractFill, RiPlayFill } from 'react-icons/ri'

const Default: FC = () => {
  const system = useContext(SystemContext)
  const [appState, setAppstate] = useContext(AppStateContext)
  const [gameViews, setGameViews] = useState<GameView[]>([])
  const onOpen = async () => {
    const elem = document.getElementById('rif-file') as HTMLInputElement
    const files = elem?.files
    if (files === null || files.length === 0) {
      console.log('No file')
      return
    }

    RIFDatabase.reset()
    const db = new RIFDatabase()
    await db.loadFromFile(files[0])
  }
  const onIndex = async () => {
    AnalyzedDatabase.reset()
    const analyzed = new AnalyzedDatabase()
    await analyzed.loadFromRIFDatabase()
  }
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
  return <Stack width={system.W}>
    <Flex>
      <Input id="rif-file" type="file" />
      <Button onClick={onOpen}>open</Button>
    </Flex>
    <Flex>
      <Button onClick={onIndex}>index</Button>
    </Flex>
    <Flex justify="center" align="center">
      <GamesTable gameViews={gameViews} />
    </Flex>
  </Stack>
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
    <colgroup span={1} style={{ width: system.W / 16 }} />
    <colgroup span={1} style={{ width: system.W / 16 }} />
    <colgroup span={1} style={{ width: system.W / 4 }} />
    <colgroup span={1} style={{ width: system.W / 8 }} />
    <tbody>
      {
        gameViews.map((g, key) => {
          return <tr
            key={key}
            onClick={() => onGameViewClick(g)}
          >
            <td>
            </td>
            <td style={{ textAlign: 'center' }}><u>{g.blackShortName}</u></td>
            <td style={{ textAlign: 'center' }}><WonIcon won={g.blackWon} /></td>
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
    case null:
      return <Icon as={RiSubtractFill} size="small" color="gray.500" />
    default:
      return <></>
  }
}

export default Default

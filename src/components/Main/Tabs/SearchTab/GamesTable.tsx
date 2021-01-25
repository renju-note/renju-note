import { Table, Tbody, Td, Th, Thead, Tr } from '@chakra-ui/react'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { GameView, RIFDatabase, RIFPlayer } from '../../../../database'
import { Game } from '../../../../rule'
import { GameState } from '../../../../state'
import { AdvancedStateContext, BoardStateContext, SystemContext } from '../../../contexts'
import { WonIcon } from '../common'

const Default: FC<{ gameIds: number[] }> = ({ gameIds }) => {
  const system = useContext(SystemContext)
  const db = useMemo(() => new RIFDatabase(), [])
  const { boardState } = useContext(BoardStateContext)
  const { advancedState, setAdvancedState } = useContext(AdvancedStateContext)
  const [items, setItems] = useState<GameView[]>([])
  useEffect(() => {
    if (gameIds.length === 0) {
      setItems([])
      return
    }
    ;(async () => setItems(await db.getGameViews(gameIds)))()
  }, [gameIds])
  const onClick = (gv: GameView) => {
    const gameState = new GameState({ main: new Game({ moves: gv.moves }), gameid: gv.id })
    setAdvancedState(advancedState.setPreviewingGame(gameState))
  }
  return (
    <Table size="rjn-info" variant="rjn-info">
      <Thead>
        <Tr>
          <Th>Date</Th>
          <Th>Black</Th>
          <Th colSpan={3}>Result</Th>
          <Th>White</Th>
          <Th>Rule</Th>
          <Th>Op.</Th>
        </Tr>
      </Thead>
      <colgroup span={1} style={{ width: (system.W * 4) / 20 }} />
      <colgroup span={1} style={{ width: (system.W * 5) / 20 }} />
      <colgroup span={1} style={{ width: (system.W * 1) / 40 }} />
      <colgroup span={1} style={{ width: (system.W * 1) / 20 }} />
      <colgroup span={1} style={{ width: (system.W * 1) / 40 }} />
      <colgroup span={1} style={{ width: (system.W * 5) / 20 }} />
      <colgroup span={1} style={{ width: (system.W * 2) / 20 }} />
      <colgroup span={1} style={{ width: (system.W * 2) / 20 }} />
      <Tbody>
        {items.map((g, key) => {
          const [mgid, pgid] = [boardState.mainGame.gameid, advancedState.previewingGame?.gameid]
          return (
            <Tr
              key={key}
              onClick={() => onClick(g)}
              bg={g.id === mgid ? 'green.100' : g.id === pgid ? 'purple.100' : undefined}
              _hover={{ bg: 'gray.100' }}
            >
              <Td isNumeric>{g.tournament.start}</Td>
              <Td>{playerShortName(g.black)}</Td>
              <Td>
                <WonIcon won={g.blackWon} />
              </Td>
              <Td>{g.moves.length.toString()}</Td>
              <Td>
                <WonIcon won={g.whiteWon} />
              </Td>
              <Td>{playerShortName(g.white)}</Td>
              <Td isNumeric>{ruleShortName(g.rule.name)}</Td>
              <Td isNumeric>{g.opening.abbr.toUpperCase()}</Td>
            </Tr>
          )
        })}
      </Tbody>
    </Table>
  )
}

const playerShortName = (p: RIFPlayer): string => `${p.name.trim()[0] ?? '?'}. ${p.surname.trim()}`

const ruleShortName = (name: string): string => {
  if (name === 'RIF') {
    return 'RIF'
  }
  let m = name.match(/^Soosyrv(-[0-9]+)?$/)
  if (m) {
    return `SS${m[1] ?? ''}`
  }
  m = name.match(/^Taraguchi(-[0-9]+)?$/)
  if (m) {
    return `TG${m[1] ?? ''}`
  }
  m = name.match(/^Yamasyrv(-[0-9]+)?$/)
  if (m) {
    return `YS${m[1] ?? ''}`
  }
  m = name.match(/^Yamaguchi$/)
  if (m) {
    return 'YG'
  }
  m = name.match(/^Tarannikov$/)
  if (m) {
    return 'TN'
  }
  m = name.match(/^Sakata$/)
  if (m) {
    return 'SK'
  }
  m = name.match(/^LinHuan$/)
  if (m) {
    return 'LH'
  }
  return 'other'
}

export default Default

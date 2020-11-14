import { Icon, Text } from '@chakra-ui/core'
import React, { FC, useContext, useEffect, useMemo, useState } from 'react'
import { RiCheckboxCircleFill, RiCloseLine, RiSubtractFill } from 'react-icons/ri'
import { GameView, RIFDatabase, RIFPlayer } from '../../../../database'
import { Game } from '../../../../rule'
import { BoardStateContext, SystemContext } from '../../../contexts'

const Default: FC<{gameIds: number[]}> = ({
  gameIds,
}) => {
  const system = useContext(SystemContext)
  const { boardState, setBoardState } = useContext(BoardStateContext)
  const db = useMemo(() => new RIFDatabase(), [])

  const [items, setItems] = useState<GameView[]>([])
  useEffect(
    () => {
      if (gameIds.length === 0) {
        setItems([])
        return
      }
      (async () => setItems(await db.getGameViews(gameIds)))()
    },
    [gameIds]
  )
  const onClick = (gv: GameView) => {
    const game = new Game({ moves: gv.moves })
    if (!game) return
    setBoardState(boardState.setPreviewingGame(game))
  }
  return <table className="search-result">
    <thead>
      <tr>
        <th>Date</th>
        <th>Black</th>
        <th colSpan={3}>Result</th>
        <th>White</th>
        <th>Rule</th>
        <th>Op.</th>
      </tr>
    </thead>
    <colgroup span={1} style={{ width: system.W * 4 / 20 }} />
    <colgroup span={1} style={{ width: system.W * 5 / 20 }} />
    <colgroup span={1} style={{ width: system.W * 1 / 40 }} />
    <colgroup span={1} style={{ width: system.W * 1 / 20 }} />
    <colgroup span={1} style={{ width: system.W * 1 / 40 }} />
    <colgroup span={1} style={{ width: system.W * 5 / 20 }} />
    <colgroup span={1} style={{ width: system.W * 2 / 20 }} />
    <colgroup span={1} style={{ width: system.W * 2 / 20 }} />
    <tbody>
      {
        items.map((g, key) => {
          return <tr
            key={key}
            onClick={() => onClick(g)}
          >
            <td>
              <Text fontFamily="Courier Prime" color="gray.600">
                {g.tournament.start}
              </Text>
            </td>
            <td>
              <Text fontFamily="Noto Serif" color="gray.800">
                {playerShortName(g.black)}
              </Text>
            </td>
            <td>
              <WonIcon won={g.blackWon} />
            </td>
            <td>
              <Text fontFamily="Noto Serif" color="gray.800">
                {g.moves.length.toString()}
              </Text>
            </td>
            <td>
              <WonIcon won={g.whiteWon} />
            </td>
            <td>
              <Text fontFamily="Noto Serif" color="gray.800">
                {playerShortName(g.white)}
              </Text>
            </td>
            <td>
              <Text fontFamily="Courier Prime" color="gray.600">
                {ruleShortName(g.rule.name)}
              </Text>
            </td>
            <td>
              <Text fontFamily="Courier Prime" color="gray.600">
                {g.opening.abbr.toUpperCase()}
              </Text>
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

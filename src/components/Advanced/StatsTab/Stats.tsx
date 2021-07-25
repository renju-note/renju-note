import { Text } from '@chakra-ui/react'
import { FC, useContext, useEffect, useMemo, useState } from 'react'
import { groupByNextMove } from '../../../analysis'
import { GameView, RIFDatabase } from '../../../database'
import { AdvancedContext } from '../../contexts'

const Default: FC = () => {
  const db = useMemo(() => new RIFDatabase(), [])
  const { searchQueryState, searchResultState } = useContext(AdvancedContext)
  const [items, setItems] = useState<GameView[]>([])
  useEffect(() => {
    const gameCount = searchResultState.gameIds.length
    if (gameCount === 0) {
      setItems([])
      return
    }
    ;(async () => setItems(await db.getGameViews(searchResultState.gameIds)))()
  }, [searchResultState.gameIds])
  const queryMoves = searchQueryState.query.moves
  if (queryMoves === undefined) return <></>
  const queryLength = queryMoves.length ?? 0
  const movesDataset = items
    .map(item => item.moves.slice(0, queryLength + 1))
    .filter(moves => moves.length === queryLength + 1)
  const groups = groupByNextMove(queryMoves, movesDataset)
  return (
    <>
      {groups.map(({ point, indices }, key) => (
        <Text key={key}>
          {point.toString()} {indices.toString()}
        </Text>
      ))}
    </>
  )
}

export default Default

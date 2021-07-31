import { decode225, encode225, Point } from '../rule'
import {
  canonicalBitboard,
  inverseVariantId,
  pointsVariants,
  pointVariant,
  toBitboardVariants,
} from './symmetry'

export const groupByNextMove = (query: Point[], dataset: Point[][]): [Point, number[]][] => {
  const queryLength = query.length
  const mapByPointCode = new Map<number, number[]>()
  for (let i = 0; i < dataset.length; i++) {
    const moves = dataset[i]
    if (moves.length <= queryLength) continue
    const [headMoves, nextMove] = [moves.slice(0, queryLength), moves[queryLength]]
    const headMovesVariants = pointsVariants(headMoves)
    const canonicalVariantId = canonicalBitboard(toBitboardVariants(headMovesVariants))[0]
    const canonicalNextMove = pointVariant(nextMove, canonicalVariantId)
    const pointCode = encode225(canonicalNextMove)
    const item = mapByPointCode.get(pointCode)
    if (item === undefined) {
      mapByPointCode.set(pointCode, [i])
    } else {
      item.push(i)
    }
  }

  const queryVariantId = canonicalBitboard(toBitboardVariants(pointsVariants(query)))[0]
  const inversedVariantId = inverseVariantId(queryVariantId)
  const mapByBoardCode = new Map<string, [Point, number[]]>()
  for (const [code, indices] of Array.from(mapByPointCode.entries())) {
    const nextMove = pointVariant(decode225(code), inversedVariantId)
    const moves = [...query, nextMove]
    const boardCode = canonicalBitboard(toBitboardVariants(pointsVariants(moves)))[1].toString()
    const item = mapByBoardCode.get(boardCode)
    if (item === undefined) {
      mapByBoardCode.set(boardCode, [nextMove, indices])
    } else {
      if (encode225(nextMove) < encode225(item[0])) item[0] = nextMove
      item[1].push(...indices)
    }
  }

  return Array.from(mapByBoardCode.values())
}

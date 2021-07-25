import { decode225, encode225, Point } from '../rule'
import {
  canonicalBitboard,
  pointsVariants,
  reverseVariantId,
  toBitboardVariants,
} from './variation'

export type MoveGroup = {
  point: Point
  indices: number[]
}

export const groupByNextMove = (queryMoves: Point[], movesDataset: Point[][]): MoveGroup[] => {
  const queryLength = queryMoves.length
  const indicesByPointCode = new Map<number, number[]>()
  for (let i = 0; i < movesDataset.length; i++) {
    const moves = movesDataset[i]
    const [headMoves, nextMove] = [moves.slice(0, queryLength), moves[queryLength]]
    const headMovesVariants = pointsVariants(headMoves)
    const canonicalVariantId = canonicalBitboard(toBitboardVariants(headMovesVariants))[0]
    const canonicalNextMove = pointsVariants([nextMove])[canonicalVariantId][0]
    const code = encode225(canonicalNextMove)
    indicesByPointCode.set(code, [...(indicesByPointCode.get(code) ?? []), i])
  }

  // TODO: merge symmetric moves

  const queryVariantId = canonicalBitboard(toBitboardVariants(pointsVariants(queryMoves)))[0]
  const reverseQueryVariantId = reverseVariantId(queryVariantId)
  return Array.from(indicesByPointCode.entries()).map(([code, indices]) => ({
    point: pointsVariants([decode225(code)])[reverseQueryVariantId][0],
    indices,
  }))
}

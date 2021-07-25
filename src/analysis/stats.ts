import { decode225, encode225, Point } from '../rule'
import {
  canonicalBitboard,
  inverseVariantId,
  pointsVariants,
  pointVariant,
  toBitboardVariants,
} from './symmetry'

export type MoveGroup = {
  point: Point
  indices: number[]
}

export const groupByNextMove = (query: Point[], dataset: Point[][]): MoveGroup[] => {
  const queryLength = query.length
  const indicesByPointCode = new Map<number, number[]>()
  for (let i = 0; i < dataset.length; i++) {
    const moves = dataset[i]
    const [headMoves, nextMove] = [moves.slice(0, queryLength), moves[queryLength]]
    const headMovesVariants = pointsVariants(headMoves)
    const canonicalVariantId = canonicalBitboard(toBitboardVariants(headMovesVariants))[0]
    const canonicalNextMove = pointVariant(nextMove, canonicalVariantId)
    const code = encode225(canonicalNextMove)
    indicesByPointCode.set(code, [...(indicesByPointCode.get(code) ?? []), i])
  }

  // TODO: merge symmetric moves

  const queryVariantId = canonicalBitboard(toBitboardVariants(pointsVariants(query)))[0]
  const inversedVariantId = inverseVariantId(queryVariantId)
  return Array.from(indicesByPointCode.entries()).map(([code, indices]) => ({
    point: pointVariant(decode225(code), inversedVariantId),
    indices,
  }))
}

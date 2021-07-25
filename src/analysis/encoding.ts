import { Point } from '../rule/foundation'
import { canonicalBitboardString, emptyBitboardVariants, pointsVariants } from './variation'

export const encodeAccumulatedMoves = (moves: Point[]): string[] => {
  const boardVariants = emptyBitboardVariants()
  const movesVariants = pointsVariants(moves)
  const result: string[] = []
  for (let i = 0; i < moves.length; i++) {
    const black = i % 2 === 0
    for (let v = 0; v < movesVariants.length; v++) {
      const point = movesVariants[v][i]
      boardVariants[v].putMut(black, point)
    }
    result[i] = canonicalBitboardString(boardVariants)
  }
  return result
}

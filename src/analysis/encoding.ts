import { Point } from '../rule/foundation'
import { BitBoard, emptyBitBoard, encodeBitBoard } from './bitboard'
import { variants } from './equivalence'

export const encodeAccumulatedMoves = (moves: Point[]): string[] => {
  const movesVariants = variants(moves)
  const boardVariants: BitBoard[] = [
    emptyBitBoard(),
    emptyBitBoard(),
    emptyBitBoard(),
    emptyBitBoard(),
    emptyBitBoard(),
    emptyBitBoard(),
    emptyBitBoard(),
    emptyBitBoard(),
  ]
  const result: string[] = []
  for (let i = 0; i < moves.length; i++) {
    const candidates: string[] = []
    for (let v = 0; v < movesVariants.length; v++) {
      const [x, y] = movesVariants[v][0][i]
      boardVariants[v][x - 1] += ((i % 2) + 1) << (2 * (y - 1))
      candidates[v] = encodeBitBoard(boardVariants[v])
    }
    result[i] = stringMin(candidates)
  }
  return result
}

const stringMin = (ss: string[]): string => {
  let min = ss[0]
  for (let i = 1; i < ss.length; i++) {
    if (ss[i] < min) min = ss[i]
  }
  return min
}

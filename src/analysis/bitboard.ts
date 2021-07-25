import { N_LINES } from '../rule/foundation'

export type BitBoard = number[]

export const emptyBitBoard = (): BitBoard => new Array(N_LINES).fill(0)

export const encodeBitBoard = (board: BitBoard): string => {
  let result = ''
  let skip = 0
  for (const line of board) {
    if (line === 0) {
      skip++
    } else {
      if (skip !== 0) {
        result += skip.toString(16) + '.'
        skip = 0
      }
      result += line.toString(16) + '/'
      skip = 0
    }
  }
  return result
}

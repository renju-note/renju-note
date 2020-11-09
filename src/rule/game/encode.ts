import { Point, N_LINES } from '../foundation'

type BitBoard = [number[], number[]]

export const encodeMoves = (moves: Point[]): string[] => {
  const movesVariants = variants(moves)
  const boardVariants: BitBoard[] = [
    [prepareHalf(), prepareHalf()],
    [prepareHalf(), prepareHalf()],
    [prepareHalf(), prepareHalf()],
    [prepareHalf(), prepareHalf()],
    [prepareHalf(), prepareHalf()],
    [prepareHalf(), prepareHalf()],
    [prepareHalf(), prepareHalf()],
    [prepareHalf(), prepareHalf()],
  ]
  const result: string[] = []
  for (let i = 0; i < moves.length; i++) {
    const candidates: string[] = []
    for (let v = 0; v < movesVariants.length; v++) {
      const [x, y] = movesVariants[v][i]
      boardVariants[v][i % 2][x - 1] += 2 ** (y - 1)
      candidates[v] = encode(boardVariants[v])
    }
    result[i] = stringMin(candidates)
  }
  return result
}

const encode = (board: BitBoard): string => {
  return '+' + encodeHalf(board[0]) + '-' + encodeHalf(board[1])
}

const encodeHalf = (a: number[]): string => {
  let result = ''
  let skip = 0
  for (let i = 0; i < a.length; i++) {
    const l = a[i]
    if (l === 0) {
      skip++
    } else {
      if (skip !== 0) {
        result += skip.toString(16) + '.'
        skip = 0
      }
      result += a[i].toString(16) + '/'
      skip = 0
    }
  }
  return result
}

const prepareHalf = (): number[] => new Array(N_LINES).fill(0)

const variants = (ps: Point[]): Point[][] => {
  return [
    variantN(ps, 0),
    variantN(ps, 1),
    variantN(ps, 2),
    variantN(ps, 3),
    variantN(ps, 4),
    variantN(ps, 5),
    variantN(ps, 6),
    variantN(ps, 7),
  ]
}

const variantN = (ps: Point[], n: number) => {
  switch (n) {
    case 0:
      return variant(ps, 0, false)
    case 1:
      return variant(ps, 0, true)
    case 2:
      return variant(ps, 90, false)
    case 3:
      return variant(ps, 90, true)
    case 4:
      return variant(ps, 180, false)
    case 5:
      return variant(ps, 180, true)
    case 6:
      return variant(ps, 270, false)
    case 7:
      return variant(ps, 270, true)
    default:
      return ps
  }
}

const variant = (ps: Point[], degree: 0 | 90 | 180 | 270, mirror: boolean): Point[] => {
  const result: Point[] = []
  for (let i = 0; i < ps.length; i++) {
    const [x, y] = mirror ? [ps[i][1], ps[i][0]] : ps[i]
    switch (degree) {
      case 0:
        result[i] = [x, y]
        break
      case 90:
        result[i] = [y, N_PLUS_1 - x]
        break
      case 180:
        result[i] = [N_PLUS_1 - x, N_PLUS_1 - y]
        break
      case 270:
        result[i] = [N_PLUS_1 - y, x]
        break
      default:
        result[i] = [x, y]
    }
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

const N_PLUS_1 = N_LINES + 1

import { Point, N_LINES } from '..'

export const encodeMoves = (moves: Point[]): string[] => {
  const movesVariants = variants(moves)
  const boardVariants = [
    prepare(),
    prepare(),
    prepare(),
    prepare(),
    prepare(),
    prepare(),
    prepare(),
    prepare(),
  ]
  const result: string[] = []
  for (let i = 0; i < moves.length; i++) {
    const candidates: string[] = []
    for (let v = 0; v < movesVariants.length; v++) {
      const [x, y] = movesVariants[v][i]
      boardVariants[v][x - 1][y - 1] = i % 2 + 1
      candidates[v] = encode(boardVariants[v])
    }
    result[i] = stringMin(candidates)
  }
  return result
}

export const encodeBoard = (blacks: Point[], whites: Point[]): string => {
  const blacksVariants = variants(blacks)
  const whitesVariants = variants(whites)
  const candidates: string[] = []
  for (let v = 0; v < blacksVariants.length; v++) {
    const blacksVariant = blacksVariants[v]
    const whitesVariant = whitesVariants[v]
    const board = prepare()
    for (let i = 0; i < blacksVariant.length; i++) {
      const [x, y] = blacksVariant[i]
      board[x - 1][y - 1] = 1
    }
    for (let i = 0; i < whitesVariant.length; i++) {
      const [x, y] = whitesVariant[i]
      board[x - 1][y - 1] = 2
    }
    candidates[v] = encode(board)
  }
  return stringMin(candidates)
}

const encode = (board: number[][]): string => {
  let code = ''
  let last = -1
  let count = 0
  for (let i = 0; i < N_LINES; i++) {
    for (let j = 0; j < N_LINES; j++) {
      const current = board[i][j]
      if (current !== last) {
        if (count > 1) code += count.toString()
        code += current === 0 ? '-' : current === 1 ? 'o' : 'x'
        last = current
        count = 1
      } else {
        count++
      }
    }
  }
  if (count > 1) code += count.toString()
  return code
}

const prepare = (): number[][] => {
  const board: number[][] = []
  for (let i = 0; i < N_LINES; i++) {
    board[i] = new Array(N_LINES).fill(0)
  }
  return board
}

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
    const p: Point = mirror ? [ps[i][1], ps[i][0]] : ps[i]
    switch (degree) {
      case 0:
        result[i] = p
        break
      case 90:
        result[i] = [p[1], N_LINES + 1 - p[0]]
        break
      case 180:
        result[i] = [N_LINES + 1 - p[0], N_LINES + 1 - p[1]]
        break
      case 270:
        result[i] = [N_LINES + 1 - p[1], p[0]]
        break
      default:
        result[i] = p
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

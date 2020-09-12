import { Facet, Direction, directions, FacetCoordinate } from './facet'
import { Row, RowKind, rowKinds } from './row'

export type Point = [number, number]
export type Arrow = [Point, Direction]

export const forbiddenKinds = ['doubleThree', 'doubleFour', 'overline'] as const
export type ForbiddenKind = typeof forbiddenKinds[number]

export class Board {
  readonly size: number
  readonly blacks: Point[]
  readonly whites: Point[]
  readonly facets: Facet[]
  readonly blackRows: Map<RowKind, [Arrow, Row][]>
  readonly whiteRows: Map<RowKind, [Arrow, Row][]>

  constructor (init: Pick<Board, 'size'> | Pick<Board, 'size' | 'blacks' | 'whites' | 'facets'>) {
    this.size = init.size
    if ('blacks' in init && 'whites' in init && 'facets' in init) {
      this.blacks = init.blacks
      this.whites = init.whites
      this.facets = init.facets
    } else {
      this.blacks = []
      this.whites = []
      this.facets = directions.map(d => new Facet({ size: this.size, direction: d }))
    }

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  put (p: Point, black: boolean): Board {
    if (this.occupied(p)) return this
    return new Board({
      size: this.size,
      blacks: black ? [...this.blacks, p] : this.blacks,
      whites: black ? this.whites : [...this.whites, p],
      facets: this.facets.map(f => f.add(black, toCoordinate(this.size, f.direction, p))),
    })
  }

  occupied (p: Point): boolean {
    return (
      (this.blacks.findIndex(q => equal(p, q)) > 0) ||
      (this.whites.findIndex(q => equal(p, q)) > 0)
    )
  }

  blackWon (): boolean {
    return (this.blackRows.get('five') ?? []).length > 0
  }

  whiteWon (): boolean {
    return (this.whiteRows.get('five') ?? []).length > 0
  }

  forbiddens (): Point[] {
    const result: Point[] = []
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        if (this.blacks.findIndex(p => equal(p, [x, y])) >= 0) continue
        if (this.whites.findIndex(p => equal(p, [x, y])) >= 0) continue
        if (forbidden(this, [x, y])) {
          result.push([x, y])
        }
      }
    }
    return result
  }

  private computeBlackRows (): Map<RowKind, [[Point, Direction], Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.facets.flatMap(
          f => (f.blackRows.get(k) ?? []).map(
            ([c, row]) => [[toPoint(this.size, f.direction, c), f.direction], row]
          )
        )
      ]
    ))
  }

  private computeWhiteRows (): Map<RowKind, [[Point, Direction], Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.facets.flatMap(
          f => (f.whiteRows.get(k) ?? []).map(
            ([c, row]) => [[toPoint(this.size, f.direction, c), f.direction], row]
          )
        )
      ]
    ))
  }
}

export const toCoordinate = (bsize: number, direction: Direction, [x, y]: Point): FacetCoordinate => {
  let i: number, j: number
  switch (direction) {
    case 'vertical':
      return [x - 1, y - 1]
    case 'horizontal':
      return [y - 1, x - 1]
    case 'ascending':
      i = (x - 1) + (bsize - y)
      j = i < bsize ? (x - 1) : (y - 1)
      return [i, j]
    case 'descending':
      i = (x - 1) + (y - 1)
      j = i < bsize ? (x - 1) : (bsize - y)
      return [i, j]
  }
}

export const toPoint = (bsize: number, direction: Direction, [i, j]: FacetCoordinate): Point => {
  let x: number, y: number
  switch (direction) {
    case 'vertical':
      return [i + 1, j + 1]
    case 'horizontal':
      return [j + 1, i + 1]
    case 'ascending':
      x = i < bsize ? j + 1 : (i + 1) + (j + 1) - bsize
      y = i < bsize ? bsize - (i + 1) + (j + 1) : j + 1
      return [x, y]
    case 'descending':
      x = i < bsize ? j + 1 : (i + 1) + (j + 1) - bsize
      y = i < bsize ? (i + 1) - j : bsize - j
      return [x, y]
  }
}

export const forbidden = (board: Board, point: Point): ForbiddenKind | undefined => {
  if (overline(board, point)) {
    return 'overline'
  } else if (doubleFour(board, point)) {
    return 'doubleFour'
  } else if (doubleThree(board, point)) {
    return 'doubleThree'
  }
}

export const overline = (board: Board, point: Point): boolean => {
  return (board.put(point, true).blackRows.get('overline') ?? []).length > 0
}

export const doubleFour = (board: Board, point: Point): boolean => {
  const newFours = (board.put(point, true).blackRows.get('four') ?? []).filter(
    ([vector, row]) => along(point, vector, row.size)
  )
  if (newFours.length < 2) return false

  // checking not open four
  const distinctFours: [Arrow, Row][] = []
  for (let i = 0; i < newFours.length; i++) {
    const four = newFours[i]
    if (distinctFours.findIndex(f => f[0][1] === four[0][1] && adjacent(f[0][0], four[0][0])) < 0) {
      distinctFours.push(four)
    }
  }
  return distinctFours.length >= 2
}

export const doubleThree = (board: Board, point: Point): boolean => {
  const nextBoard = board.put(point, true)
  const newThrees = (nextBoard.blackRows.get('three') ?? []).filter(
    ([vector, row]) => along(point, vector, row.size)
  )
  if (newThrees.length < 2) return false

  // checking not fake three
  const trueThrees: [Arrow, Row][] = []
  for (let i = 0; i < newThrees.length; i++) {
    const [[start, direction], row] = newThrees[i]
    const eyep = slide(start, direction, row.eyes[0])
    if (!forbidden(nextBoard, eyep)) {
      trueThrees.push([[start, direction], row])
    }
  }
  if (trueThrees.length < 2) return false

  // checking not open three
  const distinctThrees: [Arrow, Row][] = []
  for (let i = 0; i < trueThrees.length; i++) {
    const three = trueThrees[i]
    if (distinctThrees.findIndex(t => t[0][1] === three[0][1] && adjacent(t[0][0], three[0][0])) < 0) {
      distinctThrees.push(three)
    }
  }
  return distinctThrees.length >= 2
}

const along = (p: Point, [s, d]: [Point, Direction], l: number): boolean => {
  switch (d) {
    case 'vertical':
      return p[0] === s[0] && (s[1] <= p[1] && p[1] < (s[1] + l))
    case 'horizontal':
      return p[1] === s[1] && (s[0] <= p[0] && p[0] < (s[0] + l))
    case 'ascending':
      return (s[0] <= p[0] && p[0] < (s[0] + l)) && (p[0] - s[0] === p[1] - s[1])
    case 'descending':
      return (s[0] <= p[0] && p[0] < (s[0] + l)) && (p[0] - s[0] === s[1] - p[1])
  }
}

export const slide = (p: Point, d: Direction, i: number): Point => {
  switch (d) {
    case 'vertical':
      return [p[0], p[1] + i]
    case 'horizontal':
      return [p[0] + i, p[1]]
    case 'ascending':
      return [p[0] + i, p[1] + i]
    case 'descending':
      return [p[0] + i, p[1] - i]
  }
}

const equal = (a: Point, b: Point): boolean => a[0] === b[0] && a[1] === b[1]

const adjacent = (a: Point, b: Point): boolean => Math.abs(a[0] - b[0]) <= 1 && Math.abs(a[1] - b[1]) <= 1

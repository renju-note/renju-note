import { Facet, Direction, directions, Index } from './facet'
import { Row, RowKind, rowKinds } from './row'

export type Point = [number, number]
export type Segment = {
  start: Point
  direction: Direction
  size: number
}

export const forbiddenKinds = ['doubleThree', 'doubleFour', 'overline'] as const
export type ForbiddenKind = typeof forbiddenKinds[number]

export class Board {
  readonly size: number
  readonly blacks: Point[]
  readonly whites: Point[]
  readonly facets: Facet[]
  readonly blackRows: Map<RowKind, [Segment, Row][]>
  readonly whiteRows: Map<RowKind, [Segment, Row][]>

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
      facets: this.facets.map(f => f.add(black, toIndex(p, f.direction, this.size))),
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

  private computeBlackRows (): Map<RowKind, [Segment, Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.facets.flatMap(
          f => (f.blackRows.get(k) ?? []).map(
            ([idx, row]) => [
              {
                start: toPoint(idx, f.direction, this.size),
                direction: f.direction,
                size: row.size,
              },
              row,
            ] as [Segment, Row]
          )
        )
      ]
    ))
  }

  private computeWhiteRows (): Map<RowKind, [Segment, Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.facets.flatMap(
          f => (f.whiteRows.get(k) ?? []).map(
            ([idx, row]) => [
              {
                start: toPoint(idx, f.direction, this.size),
                direction: f.direction,
                size: row.size,
              },
              row,
            ] as [Segment, Row]
          )
        )
      ]
    ))
  }
}

const toIndex = ([x, y]: Point, direction: Direction, bsize: number): Index => {
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

const toPoint = ([i, j]: Index, direction: Direction, bsize: number): Point => {
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
  const nextBoard = board.put(point, true)
  return (nextBoard.blackRows.get('overline') ?? []).length > 0
}

export const doubleFour = (board: Board, point: Point): boolean => {
  const nextBoard = board.put(point, true)
  const newFours = (nextBoard.blackRows.get('four') ?? []).filter(([s, _]) => on(point, s))
  if (newFours.length < 2) return false

  // checking not open four
  const distinctSegs: Segment[] = []
  for (let i = 0; i < newFours.length; i++) {
    const seg = newFours[i][0]
    if (distinctSegs.findIndex(s => adjacent(seg, s)) < 0) {
      distinctSegs.push(seg)
    }
  }
  return distinctSegs.length >= 2
}

export const doubleThree = (board: Board, point: Point): boolean => {
  const nextBoard = board.put(point, true)
  const newThrees = (nextBoard.blackRows.get('three') ?? []).filter(([s, _]) => on(point, s))
  if (newThrees.length < 2) return false

  // checking not fake three
  const trueThrees: [Segment, Row][] = []
  for (let i = 0; i < newThrees.length; i++) {
    const [seg, row] = newThrees[i]
    const eyep = ith(seg, row.eyes[0])
    if (!forbidden(nextBoard, eyep)) {
      trueThrees.push([seg, row])
    }
  }
  if (trueThrees.length < 2) return false

  // checking not open three
  const distinctSegs: Segment[] = []
  for (let i = 0; i < newThrees.length; i++) {
    const seg = newThrees[i][0]
    if (distinctSegs.findIndex(s => adjacent(seg, s)) < 0) {
      distinctSegs.push(seg)
    }
  }
  return distinctSegs.length >= 2
}

export const ith = (s: Segment, i: number): Point => {
  switch (s.direction) {
    case 'vertical':
      return [s.start[0], s.start[1] + i]
    case 'horizontal':
      return [s.start[0] + i, s.start[1]]
    case 'ascending':
      return [s.start[0] + i, s.start[1] + i]
    case 'descending':
      return [s.start[0] + i, s.start[1] - i]
  }
}

const on = (p: Point, segment: Segment): boolean => {
  const [s, l] = [segment.start, segment.size]
  switch (segment.direction) {
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

const adjacent = (a: Segment, b: Segment): boolean => {
  if (a.direction !== b.direction) return false
  switch (a.direction) {
    case 'vertical':
      return a.start[0] === b.start[0] && Math.abs(a.start[1] - b.start[1]) === 1
    case 'horizontal':
      return Math.abs(a.start[0] - b.start[0]) === 1 && a.start[1] === b.start[1]
    case 'ascending':
      return Math.abs(a.start[0] - b.start[0]) === 1 && (a.start[0] - b.start[0]) === (a.start[1] - b.start[1])
    case 'descending':
      return Math.abs(a.start[0] - b.start[0]) === 1 && (a.start[0] - b.start[0]) === (b.start[1] - a.start[1])
  }
}

const equal = (a: Point, b: Point): boolean => a[0] === b[0] && a[1] === b[1]

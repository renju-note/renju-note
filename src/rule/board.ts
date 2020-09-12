import { Facet, Index, Direction, directions } from './facet'
import { Row, RowKind } from './row'

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
  }

  put (black: boolean, p: Point): Board {
    if (this.hasStone(p)) return this
    return new Board({
      size: this.size,
      blacks: black ? [...this.blacks, p] : this.blacks,
      whites: black ? this.whites : [...this.whites, p],
      facets: this.facets.map(f => f.put(black, toIndex(p, f.direction, this.size))),
    })
  }

  hasStone (p: Point): boolean {
    return (
      (this.blacks.findIndex(q => equal(p, q)) >= 0) ||
      (this.whites.findIndex(q => equal(p, q)) >= 0)
    )
  }

  forbiddens (): Point[] {
    const result: Point[] = []
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        if (this.hasStone([x, y])) continue
        if (forbidden(this, [x, y])) {
          result.push([x, y])
        }
      }
    }
    return result
  }

  getRows (black: boolean, kind: RowKind): [Segment, Row][] {
    return this.facets.flatMap(
      f => f.getRows(black, kind).map(
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
  }

  toString (): string {
    return this.facets.find(f => f.direction === 'horizontal')!.lines.slice().reverse().map(l => l.toSting()).join('\n')
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
  return board.put(true, point).getRows(true, 'overline').length > 0
}

export const doubleFour = (board: Board, point: Point): boolean => {
  const newFours = board.put(true, point).getRows(true, 'four').filter(([s, _]) => on(point, s))
  if (newFours.length < 2) return false

  // checking not open four
  return distinct(newFours.map(([seg, _]) => seg)).length >= 2
}

export const doubleThree = (board: Board, point: Point): boolean => {
  const nextBoard = board.put(true, point)
  const newThrees = nextBoard.getRows(true, 'three').filter(([s, _]) => on(point, s))
  if (newThrees.length < 2) return false

  // checking not fake three
  const trueThrees: [Segment, Row][] = []
  for (let i = 0; i < newThrees.length; i++) {
    const [seg, row] = newThrees[i]
    const eyep = ithPoint(seg, row.eyes[0])
    if (!forbidden(nextBoard, eyep)) {
      trueThrees.push([seg, row])
    }
  }
  if (trueThrees.length < 2) return false

  // checking not open three
  return distinct(newThrees.map(([seg, _]) => seg)).length >= 2
}

export const ithPoint = (s: Segment, i: number): Point => {
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

const distinct = (segments: Segment[]): Segment[] => {
  const result: Segment[] = []
  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i]
    if (result.findIndex(s => adjacent(seg, s)) < 0) {
      result.push(seg)
    }
  }
  return result
}

const adjacent = (a: Segment, b: Segment): boolean => {
  if (a.direction !== b.direction) return false
  const [xd, yd] = [a.start[0] - b.start[0], a.start[1] - b.start[1]]
  switch (a.direction) {
    case 'vertical':
      return xd === 0 && Math.abs(yd) === 1
    case 'horizontal':
      return Math.abs(xd) === 1 && yd === 0
    case 'ascending':
      return Math.abs(xd) === 1 && xd === yd
    case 'descending':
      return Math.abs(xd) === 1 && xd === -yd
  }
}

const equal = (a: Point, b: Point): boolean => a[0] === b[0] && a[1] === b[1]

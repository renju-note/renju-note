import { Stripe, StripeType, StripeCoordinate } from './stripe'
import { Row, RowType, rowTypes } from './row'

export type Point = [number, number]

export class Board {
  readonly size: number
  readonly moves: Point[]
  readonly stripes: Stripe[]
  readonly blackRows: Map<RowType, [[Point, Point], Row][]>
  readonly whiteRows: Map<RowType, [[Point, Point], Row][]>

  constructor (init: Pick<Board, 'size'> | Pick<Board, 'size' | 'moves' | 'stripes'>) {
    this.size = init.size
    if ('moves' in init && 'stripes' in init) {
      this.moves = init.moves
      this.stripes = init.stripes
    } else {
      this.moves = []
      this.stripes = [
        new Stripe({ size: this.size, type: 'vertical' }),
        new Stripe({ size: this.size, type: 'horizontal' }),
        new Stripe({ size: this.size, type: 'ascending' }),
        new Stripe({ size: this.size, type: 'descending' }),
      ]
    }

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  move (p: Point): Board {
    if (this.occupied(p)) throw new Error('Already occupied')
    const moves = [...this.moves, p]
    const black = this.blackTurn()
    const stripes = this.stripes.map(s => s.add(black, toCoordinate(this.size, s.type, p)))
    return new Board({ size: this.size, moves, stripes })
  }

  occupied ([x, y]: Point): boolean {
    return this.moves.findIndex(m => m[0] === x && m[1] === y) > 0
  }

  blackTurn (): boolean {
    return this.moves.length % 2 === 0
  }

  blackWon (): boolean {
    return (this.blackRows.get('five') ?? []).length > 0
  }

  whiteWon (): boolean {
    return (this.whiteRows.get('five') ?? []).length > 0
  }

  private computeBlackRows (): Map<RowType, [[Point, Point], Row][]> {
    return new Map(rowTypes.map(
      t => [
        t,
        this.stripes.flatMap(
          s => (s.blackRows.get(t) ?? []).map(
            ([c, row]) => [toPoints(this.size, s.type, c, row.size), row]
          )
        )
      ]
    ))
  }

  private computeWhiteRows (): Map<RowType, [[Point, Point], Row][]> {
    return new Map(rowTypes.map(
      t => [
        t,
        this.stripes.flatMap(
          s => (s.whiteRows.get(t) ?? []).map(
            ([c, row]) => [toPoints(this.size, s.type, c, row.size), row]
          )
        )
      ]
    ))
  }
}

export const toCoordinate = (size: number, type: StripeType, p: Point): StripeCoordinate => {
  switch (type) {
    case 'vertical':
      return p2v(size, p)
    case 'horizontal':
      return p2h(size, p)
    case 'ascending':
      return p2a(size, p)
    case 'descending':
      return p2d(size, p)
  }
}

const p2v = (size: number, [x, y]: Point): StripeCoordinate => [x - 1, y - 1]

const p2h = (size: number, [x, y]: Point): StripeCoordinate => [y - 1, x - 1]

const p2a = (size: number, [x, y]: Point): StripeCoordinate => {
  const i = (x - 1) + (size - y)
  const j = i < size ? (x - 1) : (y - 1)
  return [i, j]
}

const p2d = (size: number, [x, y]: Point): StripeCoordinate => {
  const i = (x - 1) + (y - 1)
  const j = i < size ? (x - 1) : (size - y)
  return [i, j]
}

export const toPoint = (size: number, type: StripeType, c: StripeCoordinate): Point => {
  switch (type) {
    case 'vertical':
      return v2p(size, c)
    case 'horizontal':
      return h2p(size, c)
    case 'ascending':
      return a2p(size, c)
    case 'descending':
      return d2p(size, c)
  }
}

const v2p = (size: number, [i, j]: StripeCoordinate): Point => [i + 1, j + 1]

const h2p = (size: number, [i, j]: StripeCoordinate): Point => [j + 1, i + 1]

const a2p = (size: number, [i, j]: StripeCoordinate): Point => {
  if (i < size) {
    return [j + 1, size - (i + 1) + (j + 1)]
  } else {
    return [(i + 1) + (j + 1) - size, j + 1]
  }
}

const d2p = (size: number, [i, j]: StripeCoordinate): Point => {
  if (i < size) {
    return [j + 1, (i + 1) - j]
  } else {
    return [(i + 1) + (j + 1) - size, size - j]
  }
}

export const toPoints = (size: number, type: StripeType, [i, j]: StripeCoordinate, rowSize: number): [Point, Point] => {
  return [toPoint(size, type, [i, j]), toPoint(size, type, [i, j + rowSize - 1])]
}

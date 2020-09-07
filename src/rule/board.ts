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

export const toCoordinate = (size: number, type: StripeType, [x, y]: Point): StripeCoordinate => {
  let i: number, j: number
  switch (type) {
    case 'vertical':
      return [x - 1, y - 1]
    case 'horizontal':
      return [y - 1, x - 1]
    case 'ascending':
      i = (x - 1) + (size - y)
      j = i < size ? (x - 1) : (y - 1)
      return [i, j]
    case 'descending':
      i = (x - 1) + (y - 1)
      j = i < size ? (x - 1) : (size - y)
      return [i, j]
  }
}

export const toPoint = (size: number, type: StripeType, [i, j]: StripeCoordinate): Point => {
  let x: number, y: number
  switch (type) {
    case 'vertical':
      return [i + 1, j + 1]
    case 'horizontal':
      return [j + 1, i + 1]
    case 'ascending':
      x = i < size ? j + 1 : (i + 1) + (j + 1) - size
      y = i < size ? size - (i + 1) + (j + 1) : j + 1
      return [x, y]
    case 'descending':
      x = i < size ? j + 1 : (i + 1) + (j + 1) - size
      y = i < size ? (i + 1) - j : size - j
      return [x, y]
  }
}

export const toPoints = (size: number, type: StripeType, [i, j]: StripeCoordinate, rowSize: number): [Point, Point] => {
  return [toPoint(size, type, [i, j]), toPoint(size, type, [i, j + rowSize - 1])]
}

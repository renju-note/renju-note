import { Point, N_INDICES } from './foundation'
import { Line, RowType, rowTypes } from './line'

export class Board {
  readonly moves: Point[]
  readonly stripes: Stripe[]
  readonly blackRows: Record<RowType, [Point, Point][]>
  readonly whiteRows: Record<RowType, [Point, Point][]>

  constructor (init?: Pick<Board, 'moves' | 'stripes'>) {
    if (init === undefined) {
      this.moves = []
      this.stripes = [
        new Stripe('vertical'),
        new Stripe('horizontal'),
        new Stripe('ascending'),
        new Stripe('descending'),
      ]
    } else {
      this.moves = init.moves
      this.stripes = init.stripes
    }

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  move (p: Point): Board {
    if (this.occupied(p)) throw new Error('Already occupied')
    const moves = [...this.moves, p]
    const black = this.blackTurn()
    const stripes = this.stripes.map(s => s.add(black, p))
    return new Board({ moves, stripes })
  }

  occupied ([x, y]: Point): boolean {
    return this.moves.findIndex(m => m[0] === x && m[1] === y) > 0
  }

  blackTurn (): boolean {
    return this.moves.length % 2 === 0
  }

  blackWon (): boolean {
    return this.blackRows.five.length > 0
  }

  whiteWon (): boolean {
    return this.whiteRows.five.length > 0
  }

  private computeBlackRows (): Record<RowType, [Point, Point][]> {
    return Object.fromEntries(rowTypes.map(
      (t) => {
        const rows = this.stripes.flatMap(s => s.blackRows[t])
        return [t, rows]
      }
    )) as Record<RowType, [Point, Point][]>
  }

  private computeWhiteRows (): Record<RowType, [Point, Point][]> {
    return Object.fromEntries(rowTypes.map(
      (t) => {
        const rows = this.stripes.flatMap(s => s.whiteRows[t])
        return [t, rows]
      }
    )) as Record<RowType, [Point, Point][]>
  }
}

export type StripeType = 'vertical' | 'horizontal' | 'ascending' | 'descending'

export type StripeCoordinate = [number, number]

export class Stripe {
  readonly type: StripeType
  readonly lines: Line[]
  readonly blackRows: Record<RowType, [Point, Point][]>
  readonly whiteRows: Record<RowType, [Point, Point][]>

  constructor (init: StripeType | Pick<Stripe, 'type' | 'lines'>) {
    if (typeof init === 'string') {
      this.type = init
      if (init === 'vertical' || init === 'horizontal') {
        this.lines = newOrthogonalLines()
      } else {
        this.lines = newDiagonalLines()
      }
    } else {
      this.type = init.type
      this.lines = init.lines
    }

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  add (black: boolean, p: Point): Stripe {
    const [i, j] = toCoordinate(this.type, p)

    const newLine = this.lines[i].add(black, j)
    if (!newLine) throw new Error('Wrong move')
    const lines = this.lines.map((l, li) => li === i ? newLine : l)

    return new Stripe({ type: this.type, lines })
  }

  private computeBlackRows (): Record<RowType, [Point, Point][]> {
    return Object.fromEntries(rowTypes.map(
      (t) => {
        const rows = this.lines.flatMap(
          (l, i) => l.blackRows[t].map(
            ([j, size]) => toPoints(this.type, [i, j], size)
          )
        )
        return [t, rows]
      }
    )) as Record<RowType, [Point, Point][]>
  }

  private computeWhiteRows (): Record<RowType, [Point, Point][]> {
    return Object.fromEntries(rowTypes.map(
      (t) => {
        const rows = this.lines.flatMap(
          (l, i) => l.whiteRows[t].map(
            ([j, size]) => toPoints(this.type, [i, j], size)
          )
        )
        return [t, rows]
      }
    )) as Record<RowType, [Point, Point][]>
  }

  toString (): string {
    return this.lines.map(l => l.toSting()).join('\n')
  }
}

const N_DIAGONAL_LINES = N_INDICES * 2 - 1 // 29

const newOrthogonalLines = (): Line[] => new Array(N_INDICES).fill(null).map(
  () => new Line(N_INDICES)
)

const newDiagonalLines = (): Line[] => new Array(N_DIAGONAL_LINES).fill(null).map(
  (_, i) => {
    const size = i < N_INDICES ? i + 1 : N_DIAGONAL_LINES - i
    return new Line(size)
  }
)

export const toCoordinate = (type: StripeType, p: Point): StripeCoordinate => {
  switch (type) {
    case 'vertical':
      return p2v(p)
    case 'horizontal':
      return p2h(p)
    case 'ascending':
      return p2a(p)
    case 'descending':
      return p2d(p)
  }
}

const p2v = ([x, y]: Point): StripeCoordinate => [x - 1, y - 1]

const p2h = ([x, y]: Point): StripeCoordinate => [y - 1, x - 1]

const p2a = ([x, y]: Point): StripeCoordinate => {
  const i = (x - 1) + (N_INDICES - y)
  const j = i < N_INDICES ? (x - 1) : (y - 1)
  return [i, j]
}

const p2d = ([x, y]: Point): StripeCoordinate => {
  const i = (x - 1) + (y - 1)
  const j = i < N_INDICES ? (x - 1) : (N_INDICES - y)
  return [i, j]
}

export const toPoint = (type: StripeType, c: StripeCoordinate): Point => {
  switch (type) {
    case 'vertical':
      return v2p(c)
    case 'horizontal':
      return h2p(c)
    case 'ascending':
      return a2p(c)
    case 'descending':
      return d2p(c)
  }
}

const v2p = ([i, j]: StripeCoordinate): Point => [i + 1, j + 1] as Point

const h2p = ([i, j]: StripeCoordinate): Point => [j + 1, i + 1] as Point

const a2p = ([i, j]: StripeCoordinate): Point => {
  if (i < N_INDICES) {
    return [j + 1, N_INDICES - (i + 1) + (j + 1)] as Point
  } else {
    return [(i + 1) + (j + 1) - N_INDICES, j + 1] as Point
  }
}

const d2p = ([i, j]: StripeCoordinate): Point => {
  if (i < N_INDICES) {
    return [j + 1, (i + 1) - j] as Point
  } else {
    return [(i + 1) + (j + 1) - N_INDICES, N_INDICES - j] as Point
  }
}

export const toPoints = (type: StripeType, [i, j]: StripeCoordinate, size: number): [Point, Point] => {
  return [toPoint(type, [i, j]), toPoint(type, [i, j + size - 1])]
}

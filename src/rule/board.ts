import { Point, N_INDICES } from './foundation'
import { Line } from './line'

export class Board {
  readonly moves: Point[]
  readonly stripes: Record<StripeType, Stripe>
  readonly blackProps: BoardProps
  readonly whiteProps: BoardProps

  constructor (init?: Pick<Board, 'moves' | 'stripes'>) {
    if (init === undefined) {
      this.moves = []
      this.stripes = {
        vertical: new Stripe('vertical'),
        horizontal: new Stripe('horizontal'),
        ascending: new Stripe('ascending'),
        descending: new Stripe('descending'),
      }
    } else {
      this.moves = init.moves
      this.stripes = init.stripes
    }

    this.blackProps = this.computeBlackProps()
    this.whiteProps = this.computeWhiteProps()
  }

  move (p: Point): Board {
    if (this.occupied(p)) throw new Error('Already occupied')
    const moves = [...this.moves, p]

    const black = this.blackTurn()
    const stripes = {
      vertical: this.stripes.vertical.add(black, p),
      horizontal: this.stripes.horizontal.add(black, p),
      ascending: this.stripes.ascending.add(black, p),
      descending: this.stripes.descending.add(black, p)
    }

    return new Board({ moves, stripes })
  }

  occupied ([x, y]: Point): boolean {
    return this.moves.findIndex(m => m[0] === x && m[1] === y) > 0
  }

  blackTurn (): boolean {
    return this.moves.length % 2 === 0
  }

  blackWon (): boolean {
    return this.blackProps.fives.length > 0
  }

  whiteWon (): boolean {
    return this.whiteProps.fives.length > 0
  }

  private computeBlackProps (): BoardProps {
    return {
      fives: this.stripeArray().flatMap(s => s.blackProps.fives)
    }
  }

  private computeWhiteProps (): BoardProps {
    return {
      fives: this.stripeArray().flatMap(s => s.whiteProps.fives)
    }
  }

  private stripeArray (): Stripe[] {
    return [
      this.stripes.vertical,
      this.stripes.horizontal,
      this.stripes.ascending,
      this.stripes.descending,
    ]
  }
}

export type BoardProps = {
  fives: [Point, Point][],
}

export type StripeType = 'vertical' | 'horizontal' | 'ascending' | 'descending'

export type StripeCoordinate = [number, number]

export class Stripe {
  readonly type_: StripeType
  readonly lines: Line[]
  readonly blackProps: StripeProps
  readonly whiteProps: StripeProps

  constructor (init: StripeType | Pick<Stripe, 'type_' | 'lines'>) {
    if (typeof init === 'string') {
      this.type_ = init
      if (init === 'vertical' || init === 'horizontal') {
        this.lines = newOrthogonalLines()
      } else {
        this.lines = newDiagonalLines()
      }
    } else {
      this.type_ = init.type_
      this.lines = init.lines
    }

    this.blackProps = this.computeBlackProps()
    this.whiteProps = this.computeWhiteProps()
  }

  add (black: boolean, p: Point): Stripe {
    const [i, j] = pointToCoordinate(p, this.type_)

    const newLine = this.lines[i].add(black, j)
    if (!newLine) throw new Error('Wrong move')
    const lines = this.lines.map((l, li) => li === i ? newLine : l)

    return new Stripe({ type_: this.type_, lines })
  }

  private computeBlackProps (): StripeProps {
    return {
      fives: this.lines.flatMap(
        (l, i) => l.blackProps.fives.map(
          ([j, size]) => [
            coordinateToPoint([i, j], this.type_), coordinateToPoint([i, j + size], this.type_)
          ]
        )
      )
    }
  }

  private computeWhiteProps (): StripeProps {
    return {
      fives: this.lines.flatMap(
        (l, i) => l.whiteProps.fives.map(
          ([j, size]) => [
            coordinateToPoint([i, j], this.type_), coordinateToPoint([i, j + size], this.type_)
          ]
        )
      )
    }
  }
}

export type StripeProps = {
  fives: [Point, Point][]
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

const pointToCoordinate = (p: Point, type_: StripeType): StripeCoordinate => {
  switch (type_) {
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

export const coordinateToPoint = (c: StripeCoordinate, type_: StripeType): Point => {
  switch (type_) {
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
    return [N_INDICES - (i + 1) - (j + 1), j + 1] as Point
  }
}

const d2p = ([i, j]: StripeCoordinate): Point => {
  if (i < N_INDICES) {
    return [j + 1, (i + 1) + (j + 1) - N_INDICES] as Point
  } else {
    return [(i + 1) + (j + 1) - N_INDICES, N_INDICES - j] as Point
  }
}

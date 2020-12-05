import { equal, Point } from '../foundation'
import { forbidden } from './forbidden'
import { RowKind } from './row'
import { Square } from './square'

export class Board {
  readonly size: number
  readonly blacks: Point[] = []
  readonly whites: Point[] = []

  private readonly square: Square
  private fcache: Point[] | undefined

  constructor(
    init:
      | Pick<Board, 'size'>
      | Pick<Board, 'size' | 'blacks' | 'whites'>
      | (Pick<Board, 'size' | 'blacks' | 'whites'> & { square: Square })
  ) {
    this.size = init.size

    if ('blacks' in init) this.blacks = init.blacks
    if ('whites' in init) this.whites = init.whites

    if ('square' in init) {
      this.square = init.square
    } else {
      this.square = new Square({ size: this.size })
        .putMulti(true, this.blacks)
        .putMulti(false, this.whites)
    }
  }

  put(black: boolean, p: Point): Board {
    if (this.has(p)) return this
    return new Board({
      size: this.size,
      blacks: black ? [...this.blacks, p] : this.blacks,
      whites: black ? this.whites : [...this.whites, p],
      square: this.square.put(black, p),
    })
  }

  remove(p: Point): Board {
    if (!this.has(p)) return this
    const bi = this.blacks.findIndex(q => equal(p, q))
    const wi = this.whites.findIndex(q => equal(p, q))
    return new Board({
      size: this.size,
      blacks: bi >= 0 ? remove(this.blacks, bi) : this.blacks,
      whites: wi >= 0 ? remove(this.whites, wi) : this.whites,
      square: this.square.remove(p),
    })
  }

  properties(black: boolean, kind: RowKind): Property[] {
    return this.square.rows.get(black, kind)
  }

  forbidden(p: Point): boolean {
    return !this.has(p) && forbidden(this.square, p) !== undefined
  }

  get forbiddens(): Point[] {
    if (this.fcache === undefined) this.fcache = this.computeForbiddens()
    return this.fcache
  }

  private computeForbiddens(): Point[] {
    const result: Point[] = []
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        if (this.has([x, y])) continue
        if (forbidden(this.square, [x, y])) result.push([x, y])
      }
    }
    return result
  }

  private has(p: Point): boolean {
    return (
      this.blacks.findIndex(q => equal(p, q)) >= 0 || this.whites.findIndex(q => equal(p, q)) >= 0
    )
  }

  toString(): string {
    return this.square.toString()
  }
}

export type Property = {
  kind: RowKind
  start: Point
  end: Point // inclusive
  eyes: Point[]
}

const remove = <T>(a: Array<T>, i: number): Array<T> => [
  ...a.slice(0, i),
  ...a.slice(i + 1, a.length),
]

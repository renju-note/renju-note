import { Point, equal } from '../foundation'
import { Square } from './square'
import { forbidden } from './forbidden'
import { RowKind, emptyRowsCache } from './row'

export class Board {
  readonly size: number
  readonly blacks: Point[]
  readonly whites: Point[]
  readonly properties: PropertiesProxy

  private readonly square: Square

  private forbiddensCache: Point[] | undefined

  constructor(
    init:
      | Pick<Board, 'size'>
      | Pick<Board, 'size' | 'blacks' | 'whites'>
      | (Pick<Board, 'size' | 'blacks' | 'whites'> & { square: Square })
  ) {
    this.size = init.size

    if ('blacks' in init && 'whites' in init) {
      this.blacks = init.blacks
      this.whites = init.whites
    } else {
      this.blacks = []
      this.whites = []
    }

    if ('square' in init) {
      this.square = init.square
    } else {
      this.square = new Square({ size: this.size })
        .putMulti(true, this.blacks)
        .putMulti(false, this.whites)
    }

    this.properties = new PropertiesProxy(this.square)
  }

  put(black: boolean, p: Point): Board {
    if (this.hasStone(p)) return this
    return new Board({
      size: this.size,
      blacks: black ? [...this.blacks, p] : this.blacks,
      whites: black ? this.whites : [...this.whites, p],
      square: this.square.put(black, p),
    })
  }

  remove(p: Point): Board {
    if (!this.hasStone(p)) return this
    const bi = this.blacks.findIndex(q => equal(p, q))
    const wi = this.whites.findIndex(q => equal(p, q))
    return new Board({
      size: this.size,
      blacks: bi >= 0 ? remove(this.blacks, bi) : this.blacks,
      whites: wi >= 0 ? remove(this.whites, wi) : this.whites,
      square: this.square.remove(p),
    })
  }

  hasStone(p: Point): boolean {
    return (
      this.blacks.findIndex(q => equal(p, q)) >= 0 || this.whites.findIndex(q => equal(p, q)) >= 0
    )
  }

  forbidden(p: Point): boolean {
    return !this.hasStone(p) && forbidden(this.square, p) !== undefined
  }

  get forbiddens(): Point[] {
    if (this.forbiddensCache === undefined) {
      this.forbiddensCache = this.computeForbiddens()
    }
    return this.forbiddensCache
  }

  private computeForbiddens(): Point[] {
    const result: Point[] = []
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        if (this.hasStone([x, y])) continue
        if (forbidden(this.square, [x, y])) {
          result.push([x, y])
        }
      }
    }
    return result
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

class PropertiesProxy {
  private readonly square: Square
  private readonly blackCache: Record<RowKind, Property[] | undefined>
  private readonly whiteCache: Record<RowKind, Property[] | undefined>

  constructor(square: Square) {
    this.square = square

    this.blackCache = emptyRowsCache()
    this.whiteCache = emptyRowsCache()
  }

  get(black: boolean, kind: RowKind): Property[] {
    const cache = black ? this.blackCache : this.whiteCache
    if (cache[kind] === undefined) {
      cache[kind] = this.compute(black, kind)
    }
    return cache[kind]!
  }

  private compute(black: boolean, kind: RowKind): Property[] {
    return this.square.rows.get(black, kind).map(srow => ({
      kind: srow.kind,
      start: srow.start,
      end: srow.end,
      eyes: srow.eyes,
    }))
  }
}

const remove = <T>(a: Array<T>, i: number): Array<T> => [
  ...a.slice(0, i),
  ...a.slice(i + 1, a.length),
]

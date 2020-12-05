import { BLACK_PATTERNS, emptyRowsCache, RowKind, search, Stones, WHITE_PATTERNS } from './row'

const INT_SIZE = 32

export class Line {
  readonly size: number
  readonly blacks: Stones
  readonly whites: Stones
  readonly rows: RowsProxy

  constructor(init: Pick<Line, 'size'> | Pick<Line, 'size' | 'blacks' | 'whites'>) {
    this.size = init.size
    if (this.size < 1 || this.size > INT_SIZE) throw new Error('Wrong size')

    if ('blacks' in init && 'whites' in init) {
      if ((init.blacks & init.whites) !== 0b0) {
        throw new Error('Black and white stones are overlapping')
      }
      this.blacks = init.blacks
      this.whites = init.whites
    } else {
      this.blacks = 0b0
      this.whites = 0b0
    }

    this.rows = new RowsProxy(this.size, this.blacks, this.whites)
  }

  put(black: boolean, i: number): Line {
    return this.overlay(black, 0b1 << i)
  }

  putMulti(black: boolean, is: number[]): Line {
    let stones = 0b0
    for (let n = 0; n < is.length; n++) {
      stones |= 0b1 << is[n]
    }
    return this.overlay(black, stones)
  }

  remove(i: number): Line {
    const mask = 0b1 << i
    const [blacks, whites] = [this.blacks & ~mask, this.whites & ~mask]
    if (blacks === this.blacks && whites === this.whites) return this
    return new Line({ size: this.size, blacks: blacks, whites: whites })
  }

  private overlay(black: boolean, stones: Stones): Line {
    if (black) {
      const [blacks, whites] = [this.blacks | stones, this.whites & ~stones]
      if (blacks === this.blacks) return this
      return new Line({ size: this.size, blacks: blacks, whites: whites })
    } else {
      const [whites, blacks] = [this.whites | stones, this.blacks & ~stones]
      if (whites === this.whites) return this
      return new Line({ size: this.size, blacks: blacks, whites: whites })
    }
  }

  toSting(): string {
    let result = ''
    for (let i = 0; i < this.size; i++) {
      const pat = 0b1 << i
      result += (this.blacks & pat) !== 0b0 ? 'o' : (this.whites & pat) !== 0b0 ? 'x' : '-'
    }
    return result
  }
}

type LineRow = {
  readonly kind: RowKind
  readonly start: number
  readonly size: number
  readonly eyes: number[]
}

class RowsProxy {
  private readonly size: number
  private readonly blacks: Stones
  private readonly whites: Stones
  private readonly blackCache: Record<RowKind, LineRow[] | undefined>
  private readonly whiteCache: Record<RowKind, LineRow[] | undefined>

  constructor(size: number, blacks: Stones, whites: Stones) {
    this.size = size
    this.blacks = blacks
    this.whites = whites

    this.blackCache = emptyRowsCache()
    this.whiteCache = emptyRowsCache()
  }

  get(black: boolean, kind: RowKind): LineRow[] {
    const cache = black ? this.blackCache : this.whiteCache
    if (cache[kind] === undefined) {
      cache[kind] = this.compute(black, kind)
    }
    return cache[kind]!
  }

  private compute(black: boolean, kind: RowKind): LineRow[] {
    const patterns = black ? BLACK_PATTERNS[kind] : WHITE_PATTERNS[kind]

    // append dummy opponent stones to both line ends
    const blacks_ = black ? this.blacks << 1 : appendDummies(this.blacks, this.size)
    const whites_ = black ? appendDummies(this.whites, this.size) : this.whites << 1
    const size_ = this.size + 2

    return patterns.flatMap(p =>
      search(blacks_, whites_, size_, p).map(i => {
        // fix index with dummy
        const start = i - 1
        return {
          kind: p.row.kind,
          start: start,
          size: p.row.size,
          eyes: p.row.eyes.map(e => e + start),
        }
      })
    )
  }
}

// e.g. (0b001110, 6) => 0b10011101
const appendDummies = (stones: Stones, size: number): Stones =>
  (stones << 1) | 0b1 | (0b1 << (size + 1))

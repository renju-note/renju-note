import {
  Stones, Row, RowKind, find,
  BLACK_PATTERNS, WHITE_PATTERNS,
} from './row'

const INT_SIZE = 32

type RowsRecord = Record<RowKind, [number, Row][] | undefined>

export class Line {
  readonly size: number
  readonly blacks: Stones
  readonly whites: Stones
  private readonly cache: [RowsRecord, RowsRecord]

  constructor (init: Pick<Line, 'size'> | Pick<Line, 'size' | 'blacks' | 'whites'>) {
    this.size = init.size
    if (this.size < 1 || this.size > INT_SIZE) throw new Error('Wrong size')

    if ('blacks' in init && 'whites' in init) {
      if ((init.blacks & init.whites) !== 0b0) throw new Error('Black and white stones are overlapping')
      this.blacks = init.blacks
      this.whites = init.whites
    } else {
      this.blacks = 0b0
      this.whites = 0b0
    }

    this.cache = [emptyRowsRecord(), emptyRowsRecord()]
  }

  put (black: boolean, i: number): Line {
    return this.overlay(black, 0b1 << i)
  }

  putMulti (black: boolean, is: number[]): Line {
    let stones = 0b0
    for (let n = 0; n < is.length; n++) {
      stones |= 0b1 << is[n]
    }
    return this.overlay(black, stones)
  }

  remove (i: number): Line {
    const mask = ~(0b1 << i)
    const [blacks, whites] = [this.blacks & mask, this.whites & mask]
    if (blacks === this.blacks && whites === this.whites) return this
    return new Line({ size: this.size, blacks: blacks, whites: whites })
  }

  getRows (black: boolean, kind: RowKind): [number, Row][] {
    const rowsCache = this.cache[black ? 0 : 1]
    let rows = rowsCache[kind]
    if (rows !== undefined) return rows

    if (black) {
      rows = BLACK_PATTERNS[kind].flatMap(p => find(this.blacks, this.whites, this.size, p))
    } else {
      rows = WHITE_PATTERNS[kind].flatMap(p => find(this.whites, this.blacks, this.size, p))
    }
    rowsCache[kind] = rows
    return rows
  }

  private overlay (black: boolean, stones: Stones): Line {
    if (black) {
      const blacks = this.blacks | stones
      if (blacks === this.blacks) return this
      return new Line({ size: this.size, blacks: blacks, whites: this.whites })
    } else {
      const whites = this.whites | stones
      if (whites === this.whites) return this
      return new Line({ size: this.size, blacks: this.blacks, whites: whites })
    }
  }

  toSting (): string {
    let result = ''
    for (let i = 0; i < this.size; i++) {
      const pat = 0b1 << i
      result += (this.blacks & pat) !== 0b0 ? 'o' : ((this.whites & pat) !== 0b0 ? 'x' : '-')
    }
    return result
  }
}

const emptyRowsRecord = (): RowsRecord => {
  return {
    three: undefined,
    four: undefined,
    five: undefined,
    overline: undefined,
  }
}

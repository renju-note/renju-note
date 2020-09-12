import {
  Stones, Row, RowKind, RowPattern, find,
  BLACK_THREE_PATTERNS, BLACK_FOUR_PATTERNS, BLACK_FIVE_PATTERNS, BLACK_OVERLINE_PATTERNS,
  WHITE_FIVE_PATTERNS,
} from './row'

const INT_SIZE = 32

export class Line {
  readonly size: number
  readonly blacks: Stones
  readonly whites: Stones
  readonly blackRows: Map<RowKind, [number, Row][]>
  readonly whiteRows: Map<RowKind, [number, Row][]>

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

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  put (black: boolean, i: number): Line {
    const stones = 0b1 << i
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

  remove (black: boolean, i: number): Line {
    const mask = ~(0b1 << i)
    if (black) {
      const blacks = this.blacks & mask
      if (blacks === this.blacks) return this
      return new Line({ size: this.size, blacks: blacks, whites: this.whites })
    } else {
      const whites = this.whites & mask
      if (whites === this.whites) return this
      return new Line({ size: this.size, blacks: this.blacks, whites: whites })
    }
  }

  private computeBlackRows (): Map<RowKind, [number, Row][]> {
    return new Map([
      ['three', BLACK_THREE_PATTERNS.flatMap(p => findBlackRows(this, p))],
      ['four', BLACK_FOUR_PATTERNS.flatMap(p => findBlackRows(this, p))],
      ['five', BLACK_FIVE_PATTERNS.flatMap(p => findBlackRows(this, p))],
      ['overline', BLACK_OVERLINE_PATTERNS.flatMap(p => findBlackRows(this, p))],
    ])
  }

  private computeWhiteRows (): Map<RowKind, [number, Row][]> {
    return new Map([
      ['five', WHITE_FIVE_PATTERNS.flatMap(p => findWhiteRows(this, p))],
    ])
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

const findBlackRows = (line: Line, pattern: RowPattern): [number, Row][] => {
  return find(line.blacks, line.whites, line.size, pattern).map(i => [i, pattern.row])
}

const findWhiteRows = (line: Line, pattern: RowPattern): [number, Row][] => {
  return find(line.whites, line.blacks, line.size, pattern).map(i => [i, pattern.row])
}

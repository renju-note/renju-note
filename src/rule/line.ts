import {
  Row, RowKind, Stones, RowPattern, find,
  BLACK_THREE_PATTERNS, BLACK_FOUR_PATTERNS, BLACK_FIVE_PATTERNS, BLACK_OVERLINE_PATTERNS,
  WHITE_FIVE_PATTERNS,
} from './row'

const INT_SIZE = 64

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
      this.blacks = init.blacks
      this.whites = init.whites
    } else {
      this.blacks = 0b0
      this.whites = 0b0
    }
    if (overlap(this.blacks, this.whites)) throw new Error('Black and white stones are overlapping')

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  add (black: boolean, i: number): Line | undefined {
    if (exists(this.blacks, i) || exists(this.whites, i)) return undefined
    if (black) {
      return new Line({ size: this.size, blacks: add(this.blacks, i), whites: this.whites })
    } else {
      return new Line({ size: this.size, blacks: this.blacks, whites: add(this.whites, i) })
    }
  }

  remove (black: boolean, i: number): Line | undefined {
    if (black) {
      if (!exists(this.blacks, i)) return undefined
      return new Line({ size: this.size, blacks: remove(this.blacks, i), whites: this.whites })
    } else {
      if (!exists(this.whites, i)) return undefined
      return new Line({ size: this.size, blacks: this.blacks, whites: remove(this.whites, i) })
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
      result += exists(this.blacks, i) ? 'o' : (exists(this.whites, i) ? 'x' : '-')
    }
    return result
  }
}

const overlap = (blacks: Stones, whites: Stones) => (blacks & whites) !== 0b0

const exists = (stones: Stones, i: number): boolean => (stones & (0b1 << i)) !== 0b0

const add = (stones: Stones, i: number): number => stones + (0b1 << i)

const remove = (stones: Stones, i: number): number => stones - (0b1 << i)

const findBlackRows = (line: Line, pattern: RowPattern): [number, Row][] => {
  return find(line.blacks, line.whites, line.size, pattern).map(i => [i, pattern.row])
}

const findWhiteRows = (line: Line, pattern: RowPattern): [number, Row][] => {
  return find(line.whites, line.blacks, line.size, pattern).map(i => [i, pattern.row])
}

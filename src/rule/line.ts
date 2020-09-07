import { N_INDICES } from './foundation'

export type Stones = number // stones as bits e.g. 0b00111010

export const rowTypes = ['three', 'four', 'five'] as const
export type RowType = typeof rowTypes[number]
export type Row = [number, number] // start, size

export class Line {
  readonly size: number
  readonly blacks: Stones
  readonly whites: Stones
  readonly blackRows: Record<RowType, Row[]>
  readonly whiteRows: Record<RowType, Row[]>

  constructor (init: number | Pick<Line, 'size' | 'blacks' | 'whites'>) {
    if (typeof init === 'number') {
      this.size = init
      this.blacks = 0b0
      this.whites = 0b0
    } else {
      this.size = init.size
      this.blacks = init.blacks
      this.whites = init.whites
    }

    if (this.size < 1 || this.size > N_INDICES) throw new Error('Wrong size')
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

  private computeBlackRows (): Record<RowType, Row[]> {
    return {
      three: findBlackThree(this),
      four: findBlackFour(this),
      five: findBlackFive(this),
    }
  }

  private computeWhiteRows (): Record<RowType, Row[]> {
    return {
      three: findWhiteThree(this),
      four: findWhiteFour(this),
      five: findWhiteFive(this),
    }
  }

  toSting (): string {
    let result = ''
    for (let i = 0; i < this.size; i++) {
      result += exists(this.blacks, i) ? 'o' : (exists(this.whites, i) ? 'x' : '-')
    }
    return result
  }
}

const appendDummy = (stones: Stones, size: number): [Stones, number] => [stones << 1, size + 2]

const overlap = (blacks: Stones, whites: Stones) => (blacks & whites) !== 0b0

const exists = (stones: Stones, i: number): boolean => (stones & (0b1 << i)) !== 0b0

const add = (stones: Stones, i: number): number => stones + (0b1 << i)

const remove = (stones: Stones, i: number): number => stones - (0b1 << i)

export const findBlackThree = (line: Line): Row[] => {
  const [blacks_, size_] = appendDummy(line.blacks, line.size)
  const patterns = [
    0b00011100,
    0b00101100,
    0b00110100,
    0b00111000,
  ]
  const candidates = find(blacks_, size_, patterns, 8)
  if (candidates.length === 0) return []

  const result: Row[] = []
  for (let i = 0; i < candidates.length; i++) {
    const row = [candidates[i][0], 6] as Row
    if (cut(line.whites, row) === 0b000000) {
      result.push(row)
    }
  }
  return result
}

export const findWhiteThree = (line: Line): Row[] => {
  const patterns = [
    0b001110,
    0b010110,
    0b011010,
    0b011100,
  ]
  const candidates = find(line.whites, line.size, patterns, 6)
  if (candidates.length === 0) return []

  const result: Row[] = []
  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i]
    if (cut(line.blacks, row) === 0b000000) {
      result.push(row)
    }
  }
  return result
}

export const findBlackFour = (line: Line): Row[] => {
  const [blacks_, size_] = appendDummy(line.blacks, line.size)
  const patterns = [
    0b0111100,
    0b0111010,
    0b0110110,
    0b0101110,
    0b0011110,
  ]
  const candidates = find(blacks_, size_, patterns, 7)
  if (candidates.length === 0) return []

  const result: Row[] = []
  for (let i = 0; i < candidates.length; i++) {
    const row = [candidates[i][0], 5] as Row
    if (cut(line.whites, row) === 0b00000) {
      result.push(row)
    }
  }
  return result
}

export const findWhiteFour = (line: Line): Row[] => {
  const patterns = [
    0b01111,
    0b11101,
    0b11011,
    0b10111,
    0b11110,
  ]
  const candidates = find(line.whites, line.size, patterns, 5)
  if (candidates.length === 0) return []

  const result: Row[] = []
  for (let i = 0; i < candidates.length; i++) {
    const row = candidates[i]
    if (cut(line.blacks, row) === 0b00000) {
      result.push(row)
    }
  }
  return result
}

export const findBlackFive = (line: Line): Row[] => {
  const [blacks_, size_] = appendDummy(line.blacks, line.size)
  const rows = find(blacks_, size_, [0b0111110], 7)
  return rows.map(r => [r[0], 5])
}

export const findWhiteFive = (line: Line): Row[] => {
  return find(line.whites, line.size, [0b11111], 5)
}

const find = (stones: Stones, within: number, patterns: Stones[], size: number): Row[] => {
  if (within < size) return []
  const result = []
  for (let i = 0; i <= within - size; i++) {
    for (let j = 0; j < patterns.length; j++) {
      if (cut(stones, [i, size]) === patterns[j]) {
        result.push([i, size] as Row)
      }
    }
  }
  return result
}

const cut = (stones: Stones, [start, size]: Row): number => (stones >> start) & (2 ** size - 1)

import { N_INDICES } from './foundation'

export type Stones = number // stones as bits e.g. 0b00111010
export type Row = [number, number] // start, size

export class Line {
  readonly size: number
  readonly blacks: Stones
  readonly whites: Stones
  readonly blackProps: LineProps
  readonly whiteProps: LineProps

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

    this.blackProps = this.computeBlackProps()
    this.whiteProps = this.computeWhiteProps()
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

  private computeBlackProps (): LineProps {
    return {
      fives: findBlackFives(this)
    }
  }

  private computeWhiteProps (): LineProps {
    return {
      fives: findWhiteFives(this)
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

export type LineProps = {
  fives: Row[]
}

const overlap = (blacks: Stones, whites: Stones) => (blacks & whites) !== 0b0

const exists = (stones: Stones, i: number): boolean => (stones & (0b1 << i)) !== 0b0

const add = (stones: Stones, i: number): number => stones + (0b1 << i)

const remove = (stones: Stones, i: number): number => stones - (0b1 << i)

export const findWhiteFives = (line: Line): Row[] => {
  return find(line.whites, line.size, [0b11111], 5)
}

export const findBlackFives = (line: Line): Row[] => {
  const blacks0 = line.blacks << 1 // append dummy bit
  return find(blacks0, line.size + 2, [0b0111110], 7)
}

export const findBlackFours = (line: Line): Row[] => {
  const patterns = [
    0b0111100,
    0b0111010,
    0b0110110,
    0b0101110,
    0b0011110,
  ]
  const stones0 = line.blacks << 1 // append dummy bit
  return find(stones0, line.size + 2, patterns, 7)
}

const find = (stones: Stones, within: number, patterns: Stones[], size: number): Row[] => {
  if (within < size) return []
  const result = []
  for (let i = 0; i <= within - size; i++) {
    for (let j = 0; j < patterns.length; j++) {
      if (cut(stones, i, size) === patterns[j]) {
        result.push([i, size] as Row)
      }
    }
  }
  return result
}

const cut = (stones: Stones, start: number, size: number): number => (stones >> start) & (2 ** size - 1)

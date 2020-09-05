import { N_INDICES } from './foundation'

export class Line {
  readonly size: number // length, between 1 and 15
  readonly blacks: number // black stones as bit e.g. 0b00111010
  readonly whites: number // white stones as bit e.g. 0b01000100
  readonly blackProps: LineProps
  readonly whiteProps: LineProps

  constructor (size: number, blacks: number = 0b0, whites: number = 0b0) {
    if (size < 1 || size > N_INDICES) throw new Error('Wrong size')
    if (overlap(blacks, whites)) throw new Error('Black and white stones are overlapping')
    this.size = size
    this.blacks = blacks
    this.whites = whites
    this.blackProps = {
      fives: findJustFive(this.blacks, this.size),
    }
    this.whiteProps = {
      fives: findFive(this.whites, this.size),
    }
  }

  add (black: boolean, i: number): Line | undefined {
    if (exists(this.blacks, i) || exists(this.whites, i)) return undefined
    if (black) {
      return new Line(this.size, add(this.blacks, i), this.whites)
    } else {
      return new Line(this.size, this.blacks, add(this.whites, i))
    }
  }

  remove (black: boolean, i: number): Line | undefined {
    if (black) {
      if (!exists(this.blacks, i)) return undefined
      return new Line(this.size, remove(this.blacks, i), this.whites)
    } else {
      if (!exists(this.whites, i)) return undefined
      return new Line(this.size, this.blacks, remove(this.whites, i))
    }
  }
}

export type LineProps = {
  fives: number[]
}

const overlap = (blacks: number, whites: number) => (blacks & whites) !== 0b0

const exists = (stones: number, i: number): boolean => (stones & (0b1 << i)) !== 0b0

const add = (stones: number, i: number): number => stones + (0b1 << i)

const remove = (stones: number, i: number): number => stones - (0b1 << i)

type PatternFinder = (bits: number, within: number) => number[]

const findFive: PatternFinder = (bits, within) => {
  if (within < 5) return []
  const result = []
  for (let i = 0; i <= within - 5; i++) {
    if (window(bits, i, 5) === 0b11111) {
      result.push(i)
    }
  }
  return result
}

const findJustFive: PatternFinder = (bits, within) => {
  if (within < 5) return []
  const bits_ = bits << 1 // dummy bit
  const result = []
  for (let i = 0; i <= within - 5; i++) {
    if (window(bits_, i, 5 + 2) === 0b0111110) {
      result.push(i)
    }
  }
  return result
}

const window = (bits: number, shift: number, size: number): number => (bits >> shift) & (2 ** size - 1)

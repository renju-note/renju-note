import { N_INDICES } from './foundation'

export class Line {
  readonly size: number // length, between 1 and 15
  readonly blacks: number // black stones as bits e.g. 0b00111010
  readonly whites: number // white stones as bits e.g. 0b01000100
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
      fives: findJustFive(this.blacks, this.size)
    }
  }

  private computeWhiteProps (): LineProps {
    return {
      fives: findFive(this.whites, this.size)
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

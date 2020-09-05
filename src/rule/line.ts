export type Line = {
  size: number // length, between 1 and 15
  blacks: number // black stones as bit e.g. 0b00111010
  whites: number // white stones as bit e.g. 0b01000100
}

export const newLine = (size: number): Line => {
  return { size: size, blacks: 0b0, whites: 0b0 }
}

export const moveOnLine = (current: Line, black: boolean, i: number): Line | undefined => {
  if (exists(current.blacks, i) || exists(current.whites, i)) return undefined
  if (black) {
    return { ...current, blacks: put(current.blacks, i) }
  } else {
    return { ...current, whites: put(current.whites, i) }
  }
}

export const findWhiteFive = (line: Line): number[] => {
  return findFive(line.whites, line.size)
}

export const findBlackFive = (line: Line): number[] => {
  return findJustFive(line.blacks, line.size)
}

const put = (bits: number, i: number): number => bits | (0b1 << i)

const exists = (bits: number, i: number): boolean => (bits & (0b1 << i)) !== 0b0

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

export type Line = {
  size: number // length, between 1 and 15
  bs: number // black stones as bit e.g. 0b00111010
  ws: number // white stones as bit e.g. 0b01000100
}

export const newLine = (size: number): Line => {
  return { size: size, bs: 0b0, ws: 0b0 }
}

export const findWhiteFive = (l: Line): number[] => {
  return findFive(l.ws, l.size)
}

export const findBlackFive = (l: Line): number[] => {
  return findJustFive(l.bs, l.size)
}

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

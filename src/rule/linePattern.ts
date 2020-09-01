import { Line } from './line'

type BlackPattern = Line

const BLACK_FOUR_PATTERN_SIZE = 7
const BLACK_FOUR_PATTERNS: BlackPattern[] = [
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0011110, ws: 0b0000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0011110, ws: 0b0000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0011110, ws: 0b1000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0011110, ws: 0b1000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0101110, ws: 0b0000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0101110, ws: 0b0000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0101110, ws: 0b1000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0101110, ws: 0b1000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0110110, ws: 0b0000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0110110, ws: 0b0000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0110110, ws: 0b1000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0110110, ws: 0b1000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111010, ws: 0b0000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111010, ws: 0b0000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111010, ws: 0b1000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111010, ws: 0b1000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111100, ws: 0b0000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111100, ws: 0b0000001 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111100, ws: 0b1000000 },
  { size: BLACK_FOUR_PATTERN_SIZE, bs: 0b0111100, ws: 0b1000001 },
]

const BLACK_THREE_PATTERN_SIZE = 8
const BLACK_THREE_PATTERNS: BlackPattern[] = [
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00011100, ws: 0b0000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00011100, ws: 0b0000001 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00011100, ws: 0b1000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00011100, ws: 0b1000001 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00101100, ws: 0b0000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00101100, ws: 0b0000001 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00101100, ws: 0b1000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00101100, ws: 0b1000001 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00110100, ws: 0b0000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00110100, ws: 0b0000001 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00110100, ws: 0b1000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00110100, ws: 0b1000001 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00111000, ws: 0b0000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00111000, ws: 0b0000001 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00111000, ws: 0b1000000 },
  { size: BLACK_THREE_PATTERN_SIZE, bs: 0b00111000, ws: 0b1000001 },
]

export const whiteWonByFive = (l: Line): [boolean, number] => {
  return hasFive(l.ws, l.size)
}

export const blackWonByFive = (l: Line): [boolean, number | undefined] => {
  return hasJustFive(l.bs, l.size)
}

const hasFive = (bits: number, within: number): [boolean, number] => {
  if (within < 5) return [false, -1]
  for (let shift = 0; shift <= within - 5; shift++) {
    if (window(bits, shift, within) === 0b11111) {
      return [true, shift]
    }
  }
  return [false, -1]
}

const hasJustFive = (bits: number, within: number): [boolean, number] => {
  if (within < 5) return [false, -1]
  const bits_ = bits << 1
  for (let shift = 0; shift <= within - 5; shift++) {
    if (window(bits_, shift, 7) === 0b0111110) {
      return [true, shift]
    }
  }
  return [false, -1]
}

const window = (bits: number, shift: number, size: number): number => (bits >> shift) & (2 ** size - 1)

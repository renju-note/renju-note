import { Line } from './line'

type BlackPattern = Line

const WHITE_FIVE_PATTERN_SIZE = 5
const WHITE_FIVE_PATTERN_WS = 0b11111

const BLACK_FIVE_PATTERN_SIZE = 7
const BLACK_FIVE_PATTERNS: BlackPattern[] = [
  { size: BLACK_FIVE_PATTERN_SIZE, bs: 0b0111110, ws: 0b0000000 },
  { size: BLACK_FIVE_PATTERN_SIZE, bs: 0b0111110, ws: 0b0000001 },
  { size: BLACK_FIVE_PATTERN_SIZE, bs: 0b0111110, ws: 0b1000000 },
  { size: BLACK_FIVE_PATTERN_SIZE, bs: 0b0111110, ws: 0b1000001 },
]

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

export const whiteWonByFive = (l: Line): [boolean, number | undefined] => {
  if (l.size < WHITE_FIVE_PATTERN_SIZE) return [false, undefined]
  for (let shift = 0; shift < l.size - WHITE_FIVE_PATTERN_SIZE; shift++) {
    const w = getWindow(l, shift, WHITE_FIVE_PATTERN_SIZE)
    if (w && w.ws === WHITE_FIVE_PATTERN_WS) {
      return [true, shift]
    }
  }
  return [false, undefined]
}

export const blackWonByFive = (l: Line): [boolean, number | undefined] => {
  if (l.size + 2 < BLACK_FIVE_PATTERN_SIZE) return [false, undefined]
  const l_ = appendWhiteToEnds(l)
  for (let shift = 0; shift <= l_.size - BLACK_FIVE_PATTERN_SIZE; shift++) {
    const w = getWindow(l_, shift, BLACK_FIVE_PATTERN_SIZE)
    if (!w) continue
    for (let i = 0; i < BLACK_FIVE_PATTERNS.length; i++) {
      const p = BLACK_FIVE_PATTERNS[i]
      if (w.bs === p.bs && w.ws === p.ws) {
        return [true, shift]
      }
    }
  }
  return [false, undefined]
}

const getWindow = (l: Line, shift: number, size: number): Line | undefined => {
  if (l.size - shift < size) {
    return undefined
  } else {
    return {
      size: size,
      bs: (l.bs >> shift) & (2 ** size - 1),
      ws: (l.ws >> shift) & (2 ** size - 1),
    }
  }
}

const appendWhiteToEnds = (l: Line): Line => {
  return {
    size: l.size + 2,
    bs: l.bs << 1, // 0b01110 -> 0b0011100
    ws: (l.ws << 1) | 0b1 | (0b1 << (l.size + 1)), // 0b01110 -> 0b1011101
  }
}

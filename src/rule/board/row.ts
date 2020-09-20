export type Stones = number // stones as bits, e.g. 0b00111010

export const rowKinds = ['two', 'three', 'four', 'five', 'overline'] as const
export type RowKind = typeof rowKinds[number]

export type Row = {
  readonly kind: RowKind
  readonly size: number
  readonly eyes: number[] // index on which the row will promote if a stone is put
}

export type RowPattern = {
  readonly row: Row
  readonly margin: number // number of points arround row that it's own stones are not present regardless of it's opponent's stones
  readonly self: Stones
  readonly opponent: Stones
}

export const find = (self: Stones, opponent: Stones, within: number, pattern: RowPattern): [number, Row][] => {
  if (within < pattern.row.size) return []
  const spat = pattern.self << pattern.margin
  const opat = pattern.opponent << pattern.margin
  const smask = 2 ** (pattern.row.size + pattern.margin * 2) - 1
  const omask = (2 ** pattern.row.size - 1) << pattern.margin

  const result: [number, Row][] = []
  self <<= pattern.margin
  opponent <<= pattern.margin
  for (let i = 0; i <= within - pattern.row.size; i++) {
    if ((self & smask) === spat && (opponent & omask) === opat) {
      result.push([i, pattern.row])
    }
    self >>>= 1
    opponent >>>= 1
  }
  return result
}

export const emptyRowsCache = (): Record<RowKind, undefined> => ({
  two: undefined,
  three: undefined,
  four: undefined,
  five: undefined,
  overline: undefined,
})

const BLACK_TWO_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'two', size: 6, eyes: [3, 4] },
    margin: 1,
    self: 0b000110,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [2, 4] },
    margin: 1,
    self: 0b001010,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [1, 4] },
    margin: 1,
    self: 0b001100,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [2, 3] },
    margin: 1,
    self: 0b010010,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [1, 3] },
    margin: 1,
    self: 0b010100,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [1, 2] },
    margin: 1,
    self: 0b011000,
    opponent: 0b000000,
  },
]

const BLACK_THREE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'three', size: 6, eyes: [4] },
    margin: 1,
    self: 0b001110,
    opponent: 0b000000,
  },
  {
    row: { kind: 'three', size: 6, eyes: [3] },
    margin: 1,
    self: 0b010110,
    opponent: 0b000000,
  },
  {
    row: { kind: 'three', size: 6, eyes: [2] },
    margin: 1,
    self: 0b011010,
    opponent: 0b000000,
  },
  {
    row: { kind: 'three', size: 6, eyes: [1] },
    margin: 1,
    self: 0b011100,
    opponent: 0b000000,
  },
]

const BLACK_FOUR_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'four', size: 5, eyes: [4] },
    margin: 1,
    self: 0b01111,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [3] },
    margin: 1,
    self: 0b10111,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [2] },
    margin: 1,
    self: 0b11011,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [1] },
    margin: 1,
    self: 0b11101,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [0] },
    margin: 1,
    self: 0b11110,
    opponent: 0b00000,
  },
]

const BLACK_FIVE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'five', size: 5, eyes: [] },
    margin: 1,
    self: 0b11111,
    opponent: 0b00000,
  },
]

const BLACK_OVERLINE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'overline', size: 6, eyes: [] },
    margin: 0,
    self: 0b111111,
    opponent: 0b000000,
  },
]

const WHITE_TWO_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'two', size: 6, eyes: [3, 4] },
    margin: 0,
    self: 0b000110,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [2, 4] },
    margin: 0,
    self: 0b001010,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [1, 4] },
    margin: 0,
    self: 0b001100,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [2, 3] },
    margin: 0,
    self: 0b010010,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [1, 3] },
    margin: 0,
    self: 0b010100,
    opponent: 0b000000,
  },
  {
    row: { kind: 'two', size: 6, eyes: [1, 2] },
    margin: 0,
    self: 0b011000,
    opponent: 0b000000,
  },
]

const WHITE_THREE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'three', size: 6, eyes: [4] },
    margin: 0,
    self: 0b001110,
    opponent: 0b000000,
  },
  {
    row: { kind: 'three', size: 6, eyes: [3] },
    margin: 0,
    self: 0b010110,
    opponent: 0b000000,
  },
  {
    row: { kind: 'three', size: 6, eyes: [2] },
    margin: 0,
    self: 0b011010,
    opponent: 0b000000,
  },
  {
    row: { kind: 'three', size: 6, eyes: [1] },
    margin: 0,
    self: 0b011100,
    opponent: 0b000000,
  },
]

const WHITE_FOUR_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'four', size: 5, eyes: [4] },
    margin: 0,
    self: 0b01111,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [3] },
    margin: 0,
    self: 0b10111,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [2] },
    margin: 0,
    self: 0b11011,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [1] },
    margin: 0,
    self: 0b11101,
    opponent: 0b00000,
  },
  {
    row: { kind: 'four', size: 5, eyes: [0] },
    margin: 0,
    self: 0b11110,
    opponent: 0b00000,
  },
]

const WHITE_FIVE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'five', size: 5, eyes: [] },
    margin: 0,
    self: 0b11111,
    opponent: 0b000000,
  }
]

export const BLACK_PATTERNS: Record<RowKind, RowPattern[]> = {
  two: BLACK_TWO_PATTERNS,
  three: BLACK_THREE_PATTERNS,
  four: BLACK_FOUR_PATTERNS,
  five: BLACK_FIVE_PATTERNS,
  overline: BLACK_OVERLINE_PATTERNS,
}

export const WHITE_PATTERNS: Record<RowKind, RowPattern[]> = {
  two: WHITE_TWO_PATTERNS,
  three: WHITE_THREE_PATTERNS,
  four: WHITE_FOUR_PATTERNS,
  five: WHITE_FIVE_PATTERNS,
  overline: [],
}

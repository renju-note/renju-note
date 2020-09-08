export type Stones = number // stones as bits, e.g. 0b00111010

export const rowKinds = ['three', 'four', 'five', 'overline'] as const
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

export const find = (self: Stones, opponent: Stones, within: number, pattern: RowPattern): number[] => {
  if (within < pattern.row.size) return []
  self <<= pattern.margin
  opponent <<= pattern.margin
  const result: number[] = []
  for (let i = 0; i <= within - pattern.row.size; i++) {
    if (match(self, opponent, pattern)) {
      result.push(i)
    }
    self >>= 1
    opponent >>= 1
  }
  return result
}

const match = (self: Stones, opponent: Stones, pattern: RowPattern): boolean => {
  return (
    (cut(self, 0, pattern.row.size + pattern.margin * 2) === pattern.self << pattern.margin) &&
    (cut(opponent, pattern.margin, pattern.row.size) === pattern.opponent)
  )
}

const cut = (stones: Stones, start: number, size: number): number => (stones >> start) & (2 ** size - 1)

export const BLACK_THREE_PATTERNS: RowPattern[] = [
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

export const BLACK_FOUR_PATTERNS: RowPattern[] = [
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

export const BLACK_FIVE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'five', size: 5, eyes: [] },
    margin: 1,
    self: 0b11111,
    opponent: 0b00000,
  },
]

export const BLACK_OVERLINE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'overline', size: 6, eyes: [] },
    margin: 0,
    self: 0b111111,
    opponent: 0b000000,
  },
]

export const WHITE_FIVE_PATTERNS: RowPattern[] = [
  {
    row: { kind: 'five', size: 5, eyes: [] },
    margin: 0,
    self: 0b11111,
    opponent: 0b000000,
  }
]

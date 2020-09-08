export type Stones = number // stones as bits e.g. 0b00111010

export const rowKinds = ['three', 'four', 'five'] as const
export type RowKind = typeof rowKinds[number]

export type Row = {
  kind: RowKind
  size: number
}

export type Stones = number // stones as bits e.g. 0b00111010

export const rowTypes = ['three', 'four', 'five'] as const
export type RowType = typeof rowTypes[number]

export type Row = {
  type: RowType
  size: number
}

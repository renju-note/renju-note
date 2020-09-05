export const N_INDICES = 15

export const indices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const

export type Index = typeof indices[number]

export type Point = [Index, Index]

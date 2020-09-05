import { Line, newLine } from './line'

export const N_INDICES = 15
export const N_WIN = 5
export const indices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const

export type Index = typeof indices[number]
export type Point = {
  x: Index
  y: Index
}

const N_DIAGONAL_LINES = N_INDICES * 2 - 1 // 29

export type OrthogonalLines = Line[]
export type DiagonalLines = Line[]

export const newOrthogonalLines = (): OrthogonalLines => new Array(N_INDICES).fill(null).map(
  () => newLine(N_INDICES)
)

export const newDiagonalLines = (): DiagonalLines => new Array(N_DIAGONAL_LINES).fill(null).map(
  (_, i_) => {
    const i = i_ + 1
    const size = i <= N_INDICES ? i : N_DIAGONAL_LINES - (i - 1)
    return newLine(size)
  }
)

export type VerticalLines = OrthogonalLines
export type HorizontalLines = OrthogonalLines
export type AscendingLines = DiagonalLines
export type DescendingLines = DiagonalLines

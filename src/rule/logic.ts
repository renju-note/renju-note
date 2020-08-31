import { N_INDICES } from './foundation'

const N_DIAGONAL_LINES = N_INDICES * 2 - 1 // 29

export type Line = boolean[]

export const newLine = (length: number): Line => new Array(length).fill(false)

export type OrthogonalLines = Line[]

export type DiagonalLines = Line[]

export const newOrthogonalLines = (): OrthogonalLines => new Array(N_INDICES).fill(null).map(() => newLine(N_INDICES))

export const newDiagonalLines = (): DiagonalLines => new Array(N_DIAGONAL_LINES).fill(null).map(
  (_, i_) => {
    const i = i_ + 1
    const length = i <= N_INDICES ? i : N_DIAGONAL_LINES - (i - 1)
    return newLine(length)
  }
)

export type VerticalLines = OrthogonalLines

export type HorizontalLines = OrthogonalLines

export type AscendingLines = DiagonalLines

export type DescendingLines = DiagonalLines

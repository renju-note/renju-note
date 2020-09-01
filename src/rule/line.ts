import { N_INDICES } from './foundation'

const N_DIAGONAL_LINES = N_INDICES * 2 - 1 // 29

export type Line = {
  size: number // length, between 1 and 15
  bs: number // black stones as bit e.g. 0b00111010
  ws: number // white stones as bit e.g. 0b01000100
}

export const newLine = (size: number): Line => {
  return { size: size, bs: 0b0, ws: 0b0 }
}

export type OrthogonalLines = Line[]

export type DiagonalLines = Line[]

export const newOrthogonalLines = (): OrthogonalLines => new Array(N_INDICES).fill(null).map(() => newLine(N_INDICES))

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

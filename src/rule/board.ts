import { Line, newLine, moveOnLine } from './line'

export const N_INDICES = 15
export const indices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const

export type Index = typeof indices[number]
export type Point = {
  x: Index
  y: Index
}

export type OrthogonalLines = Line[]
export type DiagonalLines = Line[]

export type VerticalLines = OrthogonalLines
export type HorizontalLines = OrthogonalLines
export type AscendingLines = DiagonalLines
export type DescendingLines = DiagonalLines

export type Board = {
  vLines: VerticalLines
  hLines: HorizontalLines
  aLines: AscendingLines
  dLines: DescendingLines
}

export const newBoard = (): Board => {
  return {
    vLines: newOrthogonalLines(),
    hLines: newOrthogonalLines(),
    aLines: newDiagonalLines(),
    dLines: newDiagonalLines(),
  }
}

export const moveOnBoard = (current: Board, black: boolean, p: Point): Board | undefined => {
  const nextVLines = moveOnLines(current.vLines, black, ...p2v(p))
  const nextHLines = moveOnLines(current.hLines, black, ...p2h(p))
  const nextALines = moveOnLines(current.aLines, black, ...p2a(p))
  const nextDLines = moveOnLines(current.aLines, black, ...p2d(p))
  if (!nextVLines || !nextHLines || !nextALines || !nextDLines) return undefined
  return {
    vLines: nextVLines,
    hLines: nextHLines,
    aLines: nextALines,
    dLines: nextDLines,
  }
}

const N_DIAGONAL_LINES = N_INDICES * 2 - 1 // 29

const newOrthogonalLines = (): OrthogonalLines => new Array(N_INDICES).fill(null).map(
  () => newLine(N_INDICES)
)

const newDiagonalLines = (): DiagonalLines => new Array(N_DIAGONAL_LINES).fill(null).map(
  (_, i) => {
    const size = i < N_INDICES ? i + 1 : N_DIAGONAL_LINES - i
    return newLine(size)
  }
)

const moveOnLines = (current: Line[], black: boolean, i: number, j: number): Line[] | undefined => {
  const nextLine = moveOnLine(current[i], black, j)
  if (!nextLine) return undefined
  return current.map(
    (line, li) => li === i ? nextLine : { ...line }
  )
}

type PointToLinesCoordinate = (p: Point) => [number, number]

const p2v: PointToLinesCoordinate = (p) => [p.x, p.y]

const p2h: PointToLinesCoordinate = (p) => [p.y, p.x]

const p2a: PointToLinesCoordinate = (p) => {
  const i = (p.x - 1) + (N_INDICES - p.y)
  const j = i < N_INDICES ? p.x : (p.y - 1)
  return [i, j]
}

const p2d: PointToLinesCoordinate = (p) => {
  const i = (p.x - 1) + (p.y - 1)
  const j = i < N_INDICES ? p.x : (N_INDICES - p.y)
  return [i, j]
}

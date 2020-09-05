import { Line } from './line'

export const N_INDICES = 15
export const indices = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15] as const

export type Index = typeof indices[number]

export class Point {
  readonly x: Index = 1
  readonly y: Index = 1
}

export class Board {
  moves: Point[] = []
  vLines: LineGroup // vertical lines
  hLines: LineGroup // horizontal lines
  aLines: LineGroup // ascending lines
  dLines: LineGroup // descending lines

  constructor () {
    this.vLines = new LineGroup('vertical')
    this.hLines = new LineGroup('horizontal')
    this.aLines = new LineGroup('ascending')
    this.dLines = new LineGroup('descending')
  }

  push (p: Point) {
    if (this.occupied(p)) throw new Error('Already occupied')
    this.moves.push(p)

    const black = this.blackTurn()
    this.vLines.push(black, p)
    this.hLines.push(black, p)
    this.aLines.push(black, p)
    this.dLines.push(black, p)
  }

  occupied (p: Point): boolean {
    return this.moves.findIndex(m => m.x === p.x && m.y === p.y) > 0
  }

  blackTurn (): boolean {
    return this.moves.length % 2 === 0
  }
}

export type LineGroupType = 'vertical' | 'horizontal' | 'ascending' | 'descending'

export class LineGroup {
  type_: LineGroupType
  lines: Line[]

  constructor (type_: LineGroupType) {
    this.type_ = type_
    switch (type_) {
      case 'vertical':
      case 'horizontal':
        this.lines = newOrthogonalLines()
        break
      case 'ascending':
      case 'descending':
        this.lines = newDiagonalLines()
        break
    }
  }

  push (black: boolean, p: Point) {
    var i: number, j: number
    switch (this.type_) {
      case 'vertical':
        [i, j] = p2v(p)
        break
      case 'horizontal':
        [i, j] = p2h(p)
        break
      case 'ascending':
        [i, j] = p2a(p)
        break
      case 'descending':
        [i, j] = p2d(p)
        break
    }

    const newLine = this.lines[i].add(black, j)
    if (!newLine) throw new Error('Wrong move')
    this.lines[i] = newLine
  }
}

const N_DIAGONAL_LINES = N_INDICES * 2 - 1 // 29

const newOrthogonalLines = (): Line[] => new Array(N_INDICES).fill(null).map(
  () => new Line(N_INDICES)
)

const newDiagonalLines = (): Line[] => new Array(N_DIAGONAL_LINES).fill(null).map(
  (_, i) => {
    const size = i < N_INDICES ? i + 1 : N_DIAGONAL_LINES - i
    return new Line(size)
  }
)

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

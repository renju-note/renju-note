import { Facet, FacetKind, facetKinds, FacetCoordinate } from './facet'
import { Row, RowKind, rowKinds } from './row'

export type Point = [number, number]

export class Board {
  readonly size: number
  readonly moves: Point[]
  readonly facets: Facet[]
  readonly blackRows: Map<RowKind, [[Point, Point], Row][]>
  readonly whiteRows: Map<RowKind, [[Point, Point], Row][]>

  constructor (init: Pick<Board, 'size'> | Pick<Board, 'size' | 'moves' | 'facets'>) {
    this.size = init.size
    if ('moves' in init && 'facets' in init) {
      this.moves = init.moves
      this.facets = init.facets
    } else {
      this.moves = []
      this.facets = facetKinds.map(k => new Facet({ size: this.size, kind: k }))
    }

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  move (p: Point): Board {
    if (this.occupied(p)) throw new Error('Already occupied')
    const moves = [...this.moves, p]
    const black = this.blackTurn()
    const facets = this.facets.map(s => s.add(black, toCoordinate(this.size, s.kind, p)))
    return new Board({ size: this.size, moves, facets })
  }

  occupied ([x, y]: Point): boolean {
    return this.moves.findIndex(m => m[0] === x && m[1] === y) > 0
  }

  blackTurn (): boolean {
    return this.moves.length % 2 === 0
  }

  blackWon (): boolean {
    return (this.blackRows.get('five') ?? []).length > 0
  }

  whiteWon (): boolean {
    return (this.whiteRows.get('five') ?? []).length > 0
  }

  private computeBlackRows (): Map<RowKind, [[Point, Point], Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.facets.flatMap(
          f => (f.blackRows.get(k) ?? []).map(
            ([c, row]) => [toPoints(this.size, f.kind, c, row.size), row]
          )
        )
      ]
    ))
  }

  private computeWhiteRows (): Map<RowKind, [[Point, Point], Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.facets.flatMap(
          f => (f.whiteRows.get(k) ?? []).map(
            ([c, row]) => [toPoints(this.size, f.kind, c, row.size), row]
          )
        )
      ]
    ))
  }
}

export const toCoordinate = (size: number, kind: FacetKind, [x, y]: Point): FacetCoordinate => {
  let i: number, j: number
  switch (kind) {
    case 'vertical':
      return [x - 1, y - 1]
    case 'horizontal':
      return [y - 1, x - 1]
    case 'ascending':
      i = (x - 1) + (size - y)
      j = i < size ? (x - 1) : (y - 1)
      return [i, j]
    case 'descending':
      i = (x - 1) + (y - 1)
      j = i < size ? (x - 1) : (size - y)
      return [i, j]
  }
}

export const toPoint = (size: number, kind: FacetKind, [i, j]: FacetCoordinate): Point => {
  let x: number, y: number
  switch (kind) {
    case 'vertical':
      return [i + 1, j + 1]
    case 'horizontal':
      return [j + 1, i + 1]
    case 'ascending':
      x = i < size ? j + 1 : (i + 1) + (j + 1) - size
      y = i < size ? size - (i + 1) + (j + 1) : j + 1
      return [x, y]
    case 'descending':
      x = i < size ? j + 1 : (i + 1) + (j + 1) - size
      y = i < size ? (i + 1) - j : size - j
      return [x, y]
  }
}

export const toPoints = (size: number, kind: FacetKind, [i, j]: FacetCoordinate, rowSize: number): [Point, Point] => {
  return [toPoint(size, kind, [i, j]), toPoint(size, kind, [i, j + rowSize - 1])]
}

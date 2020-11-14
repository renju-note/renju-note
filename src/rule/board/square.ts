import { Point } from '../foundation'
import { Line } from './line'
import { RowKind, emptyRowsCache } from './row'

const directions = ['vertical', 'horizontal', 'ascending', 'descending'] as const
type Direction = typeof directions[number]

type Index = [number, number]

type Facet = [Direction, Line[]]

export class Square {
  readonly size: number
  readonly facets: Facet[]
  readonly rows: RowsProxy

  constructor(init: Pick<Square, 'size'> | Pick<Square, 'size' | 'facets'>) {
    this.size = init.size

    if ('facets' in init) {
      this.facets = init.facets
    } else {
      this.facets = [
        ['vertical', newOrthogonalLines(this.size)],
        ['horizontal', newOrthogonalLines(this.size)],
        ['ascending', newDiagonalLines(this.size)],
        ['descending', newDiagonalLines(this.size)],
      ]
    }

    this.rows = new RowsProxy(this.size, this.facets)
  }

  put(black: boolean, p: Point): Square {
    const bsize = this.size
    const facets = this.facets.map(([direction, lines]) => {
      const [i, j] = toIndex(p, direction, bsize)
      const newLine = lines[i].put(black, j)
      const newLines = [...lines.slice(0, i), newLine, ...lines.slice(i + 1, lines.length)]
      return [direction, newLines] as Facet
    })
    return new Square({ size: this.size, facets: facets })
  }

  putMulti(black: boolean, ps: Point[]): Square {
    const bsize = this.size
    const facets = this.facets.map(([direction, lines]) => {
      const m = new Map<number, number[]>()
      for (let n = 0; n < ps.length; n++) {
        const [i, j] = toIndex(ps[n], direction, bsize)
        if (m.has(i)) {
          m.get(i)!.push(j)
        } else {
          m.set(i, [j])
        }
      }
      const newLines = lines.map((l, i) => (m.has(i) ? l.putMulti(black, m.get(i)!) : l))
      return [direction, newLines] as Facet
    })
    return new Square({ size: this.size, facets: facets })
  }

  remove(p: Point): Square {
    const bsize = this.size
    const facets = this.facets.map(([direction, lines]) => {
      const [i, j] = toIndex(p, direction, bsize)
      const newLine = lines[i].remove(j)
      const newLines = [...lines.slice(0, i), newLine, ...lines.slice(i + 1, lines.length)]
      return [direction, newLines] as Facet
    })
    return new Square({ size: this.size, facets: facets })
  }

  toString(): string {
    return this.facets
      .find(([d, _]) => d === 'horizontal')![1]
      .slice()
      .reverse()
      .map(l => l.toSting())
      .join('\n')
  }
}

const toIndex = ([x, y]: Point, direction: Direction, bsize: number): Index => {
  let i: number, j: number
  switch (direction) {
    case 'vertical':
      return [x - 1, y - 1]
    case 'horizontal':
      return [y - 1, x - 1]
    case 'ascending':
      i = x - 1 + (bsize - y)
      j = i < bsize ? x - 1 : y - 1
      return [i, j]
    case 'descending':
      i = x - 1 + (y - 1)
      j = i < bsize ? x - 1 : bsize - y
      return [i, j]
  }
}

const toPoint = ([i, j]: Index, direction: Direction, bsize: number): Point => {
  let x: number, y: number
  switch (direction) {
    case 'vertical':
      return [i + 1, j + 1]
    case 'horizontal':
      return [j + 1, i + 1]
    case 'ascending':
      x = i < bsize ? j + 1 : i + 1 + (j + 1) - bsize
      y = i < bsize ? bsize - (i + 1) + (j + 1) : j + 1
      return [x, y]
    case 'descending':
      x = i < bsize ? j + 1 : i + 1 + (j + 1) - bsize
      y = i < bsize ? i + 1 - j : bsize - j
      return [x, y]
  }
}

const newOrthogonalLines = (size: number): Line[] =>
  new Array(size).fill(null).map(() => new Line({ size }))

const newDiagonalLines = (size: number): Line[] =>
  new Array(size * 2 - 1)
    .fill(null)
    .map((_, i) => new Line({ size: i < size ? i + 1 : size * 2 - 1 - i }))

export type SquareRow = {
  readonly kind: RowKind
  readonly direction: Direction
  readonly start: Point
  readonly end: Point
  readonly eyes: Point[]
}

class RowsProxy {
  private readonly size: number
  private readonly facets: Facet[]
  private readonly blackCache: Record<RowKind, SquareRow[] | undefined>
  private readonly whiteCache: Record<RowKind, SquareRow[] | undefined>

  constructor(size: number, facets: Facet[]) {
    this.size = size
    this.facets = facets

    this.blackCache = emptyRowsCache()
    this.whiteCache = emptyRowsCache()
  }

  get(black: boolean, kind: RowKind): SquareRow[] {
    const cache = black ? this.blackCache : this.whiteCache
    if (cache[kind] === undefined) {
      cache[kind] = this.compute(black, kind)
    }
    return cache[kind]!
  }

  private compute(black: boolean, kind: RowKind): SquareRow[] {
    const bsize = this.size
    return this.facets.flatMap(([direction, lines]) =>
      lines.flatMap((l, i) =>
        l.rows.get(black, kind).map(lrow => ({
          kind: lrow.kind,
          direction: direction,
          start: toPoint([i, lrow.start], direction, bsize),
          end: toPoint([i, lrow.start + lrow.size - 1], direction, bsize),
          eyes: lrow.eyes.map(j => toPoint([i, j], direction, bsize)),
        }))
      )
    )
  }
}

import { Line } from './line'
import { Row, RowKind } from './row'

export type Point = [number, number]
export type Segment = {
  start: Point
  direction: Direction
  size: number
}

const directions = ['vertical', 'horizontal', 'ascending', 'descending'] as const
type Direction = typeof directions[number]

type Index = [number, number]

export class Square {
  readonly size: number
  readonly facets: [Direction, Line[]][]

  constructor (init: Pick<Square, 'size'> | Pick<Square, 'size' | 'facets'>) {
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
  }

  put (black: boolean, p: Point): Square {
    const bsize = this.size
    const facets = this.facets.map(
      ([direction, lines]) => {
        const [i, j] = toIndex(p, direction, bsize)
        const newLine = lines[i].put(black, j)
        const newLines = [...lines.slice(0, i), newLine, ...lines.slice(i + 1, lines.length)]
        return [direction, newLines] as [Direction, Line[]]
      }
    )
    return new Square({ size: this.size, facets: facets })
  }

  getRows (black: boolean, kind: RowKind): [Segment, Row][] {
    const bsize = this.size
    return this.facets.flatMap(
      ([direction, lines]) => lines.flatMap(
        (l, i) => l.getRows(black, kind).map(
          ([j, row]) => [
            {
              start: toPoint([i, j], direction, bsize),
              direction: direction,
              size: row.size,
            },
            row,
          ] as [Segment, Row]
        )
      )
    )
  }

  toString (): string {
    return this.facets.find(([d, _]) => d === 'horizontal')![1].slice().reverse().map(l => l.toSting()).join('\n')
  }
}

export const ithPoint = (s: Segment, i: number): Point => {
  switch (s.direction) {
    case 'vertical':
      return [s.start[0], s.start[1] + i]
    case 'horizontal':
      return [s.start[0] + i, s.start[1]]
    case 'ascending':
      return [s.start[0] + i, s.start[1] + i]
    case 'descending':
      return [s.start[0] + i, s.start[1] - i]
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
      i = (x - 1) + (bsize - y)
      j = i < bsize ? (x - 1) : (y - 1)
      return [i, j]
    case 'descending':
      i = (x - 1) + (y - 1)
      j = i < bsize ? (x - 1) : (bsize - y)
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
      x = i < bsize ? j + 1 : (i + 1) + (j + 1) - bsize
      y = i < bsize ? bsize - (i + 1) + (j + 1) : j + 1
      return [x, y]
    case 'descending':
      x = i < bsize ? j + 1 : (i + 1) + (j + 1) - bsize
      y = i < bsize ? (i + 1) - j : bsize - j
      return [x, y]
  }
}

const newOrthogonalLines = (size: number): Line[] => new Array(size).fill(null).map(
  () => new Line({ size })
)

const newDiagonalLines = (size: number): Line[] => new Array(size * 2 - 1).fill(null).map(
  (_, i) => new Line({ size: i < size ? i + 1 : size * 2 - 1 - i })
)

import { Line } from './line'
import { Row, RowKind, rowKinds } from './row'

export const directions = ['vertical', 'horizontal', 'ascending', 'descending'] as const
export type Direction = typeof directions[number]

export type Index = [number, number]

export class Facet {
  readonly size: number
  readonly direction: Direction
  readonly lines: Line[]
  readonly blackRows: Map<RowKind, [Index, Row][]>
  readonly whiteRows: Map<RowKind, [Index, Row][]>

  constructor (init: Pick<Facet, 'size' | 'direction'> | Pick<Facet, 'size' | 'direction' | 'lines'>) {
    this.size = init.size
    this.direction = init.direction
    if ('lines' in init) {
      this.lines = init.lines
    } else {
      if (this.direction === 'vertical' || this.direction === 'horizontal') {
        this.lines = newOrthogonalLines(this.size)
      } else {
        this.lines = newDiagonalLines(this.size)
      }
    }

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  put (black: boolean, [i, j]: Index): Facet {
    const newLine = this.lines[i].put(black, j)
    if (newLine === this.lines[i]) return this

    const lines = [...this.lines.slice(0, i), newLine, ...this.lines.slice(i + 1, this.lines.length)]
    return new Facet({ size: this.size, direction: this.direction, lines: lines })
  }

  private computeBlackRows (): Map<RowKind, [Index, Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.lines.flatMap(
          (l, i) => (l.blackRows.get(k) ?? []).map(
            ([j, row]) => [[i, j] as Index, row]
          )
        )
      ]
    ))
  }

  private computeWhiteRows (): Map<RowKind, [Index, Row][]> {
    return new Map(rowKinds.map(
      k => [
        k,
        this.lines.flatMap(
          (l, i) => (l.whiteRows.get(k) ?? []).map(
            ([j, row]) => [[i, j] as Index, row]
          )
        )
      ]
    ))
  }

  toString (): string {
    return this.lines.map(l => l.toSting()).join('\n')
  }
}

const newOrthogonalLines = (size: number): Line[] => new Array(size).fill(null).map(
  () => new Line({ size })
)

const newDiagonalLines = (size: number): Line[] => new Array(size * 2 - 1).fill(null).map(
  (_, i) => new Line({ size: i < size ? i + 1 : size * 2 - 1 - i })
)

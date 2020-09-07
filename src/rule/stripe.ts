import { Line } from './line'
import { Row, RowType, rowTypes } from './row'

export type StripeType = 'vertical' | 'horizontal' | 'ascending' | 'descending'

export type StripeCoordinate = [number, number]

export class Stripe {
  readonly size: number
  readonly type: StripeType
  readonly lines: Line[]
  readonly blackRows: Map<RowType, [StripeCoordinate, Row][]>
  readonly whiteRows: Map<RowType, [StripeCoordinate, Row][]>

  constructor (init: Pick<Stripe, 'size' | 'type'> | Pick<Stripe, 'size' | 'type' | 'lines'>) {
    this.size = init.size
    this.type = init.type
    if ('lines' in init) {
      this.lines = init.lines
    } else {
      if (this.type === 'vertical' || this.type === 'horizontal') {
        this.lines = newOrthogonalLines(this.size)
      } else {
        this.lines = newDiagonalLines(this.size)
      }
    }

    this.blackRows = this.computeBlackRows()
    this.whiteRows = this.computeWhiteRows()
  }

  add (black: boolean, [i, j]: StripeCoordinate): Stripe {
    const newLine = this.lines[i].add(black, j)
    if (!newLine) throw new Error('Wrong move')
    const lines = this.lines.map((l, li) => li === i ? newLine : l)

    return new Stripe({ size: this.size, type: this.type, lines })
  }

  private computeBlackRows (): Map<RowType, [StripeCoordinate, Row][]> {
    return new Map(rowTypes.map(
      t => [
        t,
        this.lines.flatMap(
          (l, i) => (l.blackRows.get(t) ?? []).map(
            ([j, row]) => [[i, j] as StripeCoordinate, row]
          )
        )
      ]
    ))
  }

  private computeWhiteRows (): Map<RowType, [StripeCoordinate, Row][]> {
    return new Map(rowTypes.map(
      t => [
        t,
        this.lines.flatMap(
          (l, i) => (l.whiteRows.get(t) ?? []).map(
            ([j, row]) => [[i, j] as StripeCoordinate, row]
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

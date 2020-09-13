import { Point, Segment, Square } from './square'
import { forbidden } from './forbidden'
import { Row, RowKind } from './row'

export class Board {
  readonly size: number
  readonly blacks: Point[]
  readonly whites: Point[]
  readonly square: Square

  constructor (init: Pick<Board, 'size'> | Pick<Board, 'size' | 'blacks' | 'whites' | 'square'>) {
    this.size = init.size
    if ('blacks' in init && 'whites' in init && 'square' in init) {
      this.blacks = init.blacks
      this.whites = init.whites
      this.square = init.square
    } else {
      this.blacks = []
      this.whites = []
      this.square = new Square({ size: this.size })
    }
  }

  put (black: boolean, p: Point): Board {
    if (this.hasStone(p)) return this
    return new Board({
      size: this.size,
      blacks: black ? [...this.blacks, p] : this.blacks,
      whites: black ? this.whites : [...this.whites, p],
      square: this.square.put(black, p),
    })
  }

  hasStone (p: Point): boolean {
    return (
      (this.blacks.findIndex(q => equal(p, q)) >= 0) ||
      (this.whites.findIndex(q => equal(p, q)) >= 0)
    )
  }

  forbiddens (): Point[] {
    const result: Point[] = []
    for (let x = 1; x <= this.size; x++) {
      for (let y = 1; y <= this.size; y++) {
        if (this.hasStone([x, y])) continue
        if (forbidden(this.square, [x, y])) {
          result.push([x, y])
        }
      }
    }
    return result
  }

  getRows (black: boolean, kind: RowKind): [Segment, Row][] {
    return this.square.getRows(black, kind)
  }

  toString (): string {
    return this.square.toString()
  }
}

const equal = (a: Point, b: Point): boolean => a[0] === b[0] && a[1] === b[1]

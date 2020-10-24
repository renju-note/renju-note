import { Point, equal } from '../rule'

export class FreeState {
  readonly blacks: Point[] = []
  readonly whites: Point[] = []

  constructor (
    init:
      | {}
      | Pick<FreeState, 'blacks' | 'whites'>
  ) {
    if ('blacks' in init && 'whites' in init) {
      this.blacks = init.blacks
      this.whites = init.whites
    }
  }

  put (black: boolean, p: Point): FreeState {
    if (!this.canPut(p)) return this
    return new FreeState({
      blacks: black ? [...this.blacks, p] : this.blacks,
      whites: black ? this.whites : [...this.whites, p],
    })
  }

  undo (black: boolean): FreeState {
    return new FreeState({
      blacks: black ? this.blacks.slice(0, this.blacks.length - 1) : this.blacks,
      whites: black ? this.whites : this.whites.slice(0, this.whites.length - 1),
    })
  }

  canPut (p: Point): boolean {
    return (
      this.blacks.findIndex(q => equal(p, q)) < 0 &&
      this.whites.findIndex(q => equal(p, q)) < 0
    )
  }

  canUndo (black: boolean): boolean {
    return black ? this.blacks.length > 0 : this.whites.length > 0
  }
}

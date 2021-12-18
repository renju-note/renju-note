import { parsePoints, Point, pointEqual, wrapPoints } from 'renjukit'

export class Game {
  readonly moves: Point[] = []
  readonly inverted: boolean = false

  constructor(init?: undefined | Partial<Game>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<Game>): Game {
    return new Game({ ...this, ...fields })
  }

  move(p: Point): Game {
    if (this.has(p)) return this
    return this.update({
      moves: [...this.moves, p],
    })
  }

  undo(): Game {
    if (this.moves.length === 0) return this
    return this.update({
      moves: this.moves.slice(0, this.moves.length - 1),
    })
  }

  has(p: Point): boolean {
    return this.moves.findIndex(q => pointEqual(p, q)) >= 0
  }

  cut(length: number): Game {
    return this.update({ moves: this.moves.slice(0, length) })
  }

  invert(inverted: boolean): Game {
    return this.update({ inverted })
  }

  get canUndo(): boolean {
    return this.moves.length > 0
  }

  get blacks(): Point[] {
    const r = this.inverted ? 1 : 0
    return this.moves.filter((p, i) => i % 2 === r)
  }

  get whites(): Point[] {
    const r = this.inverted ? 0 : 1
    return this.moves.filter((p, i) => i % 2 === r)
  }

  get lastMove(): Point | undefined {
    return this.moves[this.moves.length - 1]
  }

  get isBlackTurn(): boolean {
    const r = this.inverted ? 1 : 0
    return this.moves.length % 2 === r
  }

  get size(): number {
    return this.moves.length
  }

  get empty(): boolean {
    return this.moves.length === 0
  }

  encode(separator: string = ''): string {
    return wrapPoints(this.moves).toString(separator)
  }

  static decode(code: string): Game | undefined {
    const points = parsePoints(code)
    return points && new Game({ moves: points })
  }
}

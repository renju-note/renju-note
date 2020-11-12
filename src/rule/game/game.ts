import { decodePoints, encodePoints } from '../encoding'
import { equal, Point } from '../foundation'

export class Game {
  readonly moves: Point[] = []

  constructor (init?: undefined | Partial<Game>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update (fields: Partial<Game>): Game {
    return new Game({ ...this, ...fields })
  }

  move (p: Point): Game {
    if (!this.movable(p)) return this
    return this.update({
      moves: [...this.moves, p],
    })
  }

  undo (): Game {
    if (this.moves.length === 0) return this
    return this.update({
      moves: this.moves.slice(0, this.moves.length - 1),
    })
  }

  movable (p: Point): boolean {
    return this.moves.findIndex(q => equal(p, q)) < 0
  }

  fork (i: number): Game {
    return new Game({
      moves: this.moves.slice(0, i),
    })
  }

  get canUndo (): boolean {
    return this.moves.length > 0
  }

  get blacks (): Point[] {
    const result: Point[] = []
    for (let i = 0; i < this.moves.length; i += 2) {
      result[~~(i / 2)] = this.moves[i]
    }
    return result
  }

  get whites (): Point[] {
    const result: Point[] = []
    for (let i = 1; i < this.moves.length; i += 2) {
      result[~~((i - 1) / 2)] = this.moves[i]
    }
    return result
  }

  get lastMove (): Point | undefined {
    return this.moves[this.moves.length - 1]
  }

  get isBlackTurn (): boolean {
    return this.moves.length % 2 === 0
  }

  get isFirstTurn (): boolean {
    return this.isBlackTurn
  }

  get empty (): boolean {
    return this.moves.length === 0
  }

  encode (): string {
    return encodePoints(this.moves)
  }

  static decode (code: string): Game | undefined {
    const points = decodePoints(code)
    return points && new Game({ moves: points })
  }
}

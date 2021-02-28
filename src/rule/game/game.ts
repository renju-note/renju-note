import { decodePoints, encodePoints } from '../encoding'
import { equal, Point } from '../foundation'

export class Game {
  readonly moves: Point[] = []
  private blacksCache: Point[] | undefined
  private whitesCache: Point[] | undefined

  constructor(init?: undefined | Partial<Game>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<Game>): Game {
    return new Game({ ...this, ...fields, blacksCache: undefined, whitesCache: undefined })
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
    return this.moves.findIndex(q => equal(p, q)) >= 0
  }

  partial(length: number): Game {
    return this.update({ moves: this.moves.slice(0, length) })
  }

  get canUndo(): boolean {
    return this.moves.length > 0
  }

  get blacks(): Point[] {
    if (this.blacksCache === undefined) {
      const result: Point[] = []
      for (let i = 0; i < this.moves.length; i += 2) {
        result[~~(i / 2)] = this.moves[i]
      }
      this.blacksCache = result
    }
    return this.blacksCache
  }

  get whites(): Point[] {
    if (this.whitesCache === undefined) {
      const result: Point[] = []
      for (let i = 1; i < this.moves.length; i += 2) {
        result[~~((i - 1) / 2)] = this.moves[i]
      }
      this.whitesCache = result
    }
    return this.whitesCache
  }

  get lastMove(): Point | undefined {
    return this.moves[this.moves.length - 1]
  }

  get isBlackTurn(): boolean {
    return this.moves.length % 2 === 0
  }

  get size(): number {
    return this.moves.length
  }

  get empty(): boolean {
    return this.moves.length === 0
  }

  encode(separator: string = ''): string {
    return encodePoints(this.moves, separator)
  }

  static decode(code: string): Game | undefined {
    const points = decodePoints(code)
    return points && new Game({ moves: points })
  }
}

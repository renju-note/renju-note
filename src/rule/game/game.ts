import { code, equal, parsePoints, Point } from '../foundation'

export class Game {
  readonly moves: Point[]

  constructor (init: {} | Pick<Game, 'moves'>) {
    if ('moves' in init) {
      this.moves = init.moves
    } else {
      this.moves = []
    }
  }

  static fromCode (code: string): Game | undefined {
    const points = parsePoints(code)
    return points && new Game({ moves: points })
  }

  move (p: Point): Game {
    if (!this.movable(p)) return this
    return new Game({
      moves: [...this.moves, p],
    })
  }

  undo (): Game {
    if (this.moves.length === 0) return this
    return new Game({
      moves: this.moves.slice(0, this.moves.length - 1),
    })
  }

  movable (p: Point): boolean {
    return this.moves.findIndex(q => equal(p, q)) < 0
  }

  fork (i: number): Game {
    return new Game({ moves: this.moves.slice(0, i) })
  }

  get canUndo (): boolean {
    return this.moves.length > 0
  }

  get blacks (): Point[] {
    return this.moves.filter((_, i) => i % 2 === 0)
  }

  get whites (): Point[] {
    return this.moves.filter((_, i) => i % 2 !== 0)
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

  get code (): string {
    return this.moves.map(code).join('')
  }
}

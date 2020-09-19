import { Point, equal } from '../foundation'

export class Game {
  readonly moves: Point[]

  constructor (init: {} | Pick<Game, 'moves'>) {
    if ('moves' in init) {
      this.moves = init.moves
    } else {
      this.moves = []
    }
  }

  move (p: Point): Game | undefined {
    if (this.moves.findIndex(q => equal(p, q)) >= 0) return undefined
    return new Game({
      moves: [...this.moves, p],
    })
  }

  moveMulti (ps: Point[]): Game | undefined {
    if (this.moves.findIndex(q => ps.findIndex(p => equal(p, q)) >= 0) >= 0) return undefined
    return new Game({
      moves: [...this.moves, ...ps],
    })
  }

  undo (): Game | undefined {
    if (this.moves.length === 0) return undefined
    return new Game({
      moves: this.moves.slice(0, this.moves.length - 1),
    })
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
}

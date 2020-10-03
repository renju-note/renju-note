import { code, equal, Point, point } from '../foundation'

export class Game {
  readonly moves: Point[]

  constructor (init: {} | { code: string } | Pick<Game, 'moves'>) {
    if ('moves' in init) {
      this.moves = init.moves
    } else if ('code' in init) {
      this.moves = []
      const codes = Array.from(init.code.matchAll(/[a-zA-Z][0-9]+/g)).map(m => m[0])
      for (let i = 0; i < codes.length; i++) {
        const p = point(codes[i])
        if (p === undefined) throw new Error(`invalid code: ${codes[i]}`)
        this.moves.push(p)
      }
    } else {
      this.moves = []
    }
  }

  move (p: Point): Game | undefined {
    if (!this.movable(p)) return undefined
    return new Game({
      moves: [...this.moves, p],
    })
  }

  undo (): Game | undefined {
    if (this.moves.length === 0) return undefined
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

  get code (): string {
    return this.moves.map(code).join('')
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

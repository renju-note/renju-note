import { Game, Point } from '../rule'

export class GameState {
  readonly game: Game
  readonly cursor: number

  constructor (
    init:
      | {}
      | {code: string}
      | Pick<GameState, 'game' | 'cursor'>
  ) {
    if ('game' in init) {
      this.game = init.game
      this.cursor = init.cursor
    } else if ('code' in init) {
      const codes = init.code.split('/')
      if (codes.length !== 2) throw new Error('invalid code')
      const [gameCode, cursorCode] = codes
      this.game = new Game({ code: gameCode })
      this.cursor = parseInt(cursorCode)
    } else {
      this.game = new Game({})
      this.cursor = 0
    }
  }

  move (p: Point): GameState {
    if (!this.isLast) return this
    const game = this.game.move(p)
    if (game === undefined) return this
    return new GameState({
      game: game,
      cursor: this.cursor + 1,
    })
  }

  undo (): GameState {
    if (!this.canUndo) return this
    const game = this.game.undo()
    if (game === undefined) return this
    return new GameState({
      game: game,
      cursor: this.cursor - 1,
    })
  }

  forward (): GameState {
    return this.jump(this.cursor + 1)
  }

  backward (): GameState {
    return this.jump(this.cursor - 1)
  }

  toStart (): GameState {
    return this.jump(0)
  }

  toLast (): GameState {
    return this.jump(this.game.moves.length)
  }

  jump (i: number): GameState {
    if (i < 0 || this.game.moves.length < i) return this
    return new GameState({
      game: this.game,
      cursor: i,
    })
  }

  get moves (): Point[] {
    return this.game.fork(this.cursor).moves
  }

  get blacks (): Point[] {
    return this.game.fork(this.cursor).blacks
  }

  get whites (): Point[] {
    return this.game.fork(this.cursor).whites
  }

  get isStart (): boolean {
    return this.cursor === 0
  }

  get isLast (): boolean {
    return this.cursor === this.game.moves.length
  }

  get canUndo (): boolean {
    return this.isLast && !this.isStart
  }

  get code (): string {
    return `${this.game.code}/${this.cursor}`
  }
}

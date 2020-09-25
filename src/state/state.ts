import { Game, Board, N_LINES, Point } from '../rule'

export class State {
  readonly game: Game
  readonly cursor: number
  readonly board: Board

  constructor (init: {} | Pick<State, 'game' | 'cursor' | 'board'>) {
    if ('game' in init) {
      this.game = init.game
      this.cursor = init.cursor
      this.board = init.board
    } else {
      this.game = new Game({})
      this.cursor = 0
      this.board = new Board({ size: N_LINES })
    }
  }

  move (p: Point): State {
    if (!this.canMove) return this
    if (this.game.isBlackTurn && this.board.forbidden(p)) return this

    const game = this.game.move(p)
    if (game === undefined) return this
    return new State({
      game: game,
      board: this.board.put(this.game.isBlackTurn, p),
      cursor: this.cursor + 1,
    })
  }

  undo (): State {
    if (!this.canUndo) return this

    const game = this.game.undo()
    if (game === undefined) return this
    return new State({
      game: game,
      board: this.board.remove(this.game.moves[this.game.moves.length - 1]),
      cursor: this.cursor - 1,
    })
  }

  reset (): State {
    if (!this.canReset) return this
    return new State({})
  }

  forward (): State {
    if (this.isLast) return this
    return new State({
      game: this.game,
      board: this.board.put(this.cursor % 2 === 0, this.game.moves[this.cursor]),
      cursor: this.cursor + 1,
    })
  }

  backward (): State {
    if (this.isStart) return this
    return new State({
      game: this.game,
      board: this.board.remove(this.game.moves[this.cursor - 1]),
      cursor: this.cursor - 1,
    })
  }

  jump (i: number): State {
    if (i < 0 || this.game.moves.length < i) return this
    const forked = this.game.fork(i)
    return new State({
      game: this.game,
      board: new Board({
        size: this.board.size,
        blacks: forked.blacks,
        whites: forked.whites,
      }),
      cursor: i,
    })
  }

  toStart (): State {
    return this.jump(0)
  }

  toLast (): State {
    return this.jump(this.game.moves.length)
  }

  get isStart (): boolean {
    return this.cursor === 0
  }

  get isLast (): boolean {
    return this.cursor === this.game.moves.length
  }

  get canMove (): boolean {
    return this.isLast
  }

  get canUndo (): boolean {
    return this.isLast && !this.isStart
  }

  get canReset (): boolean {
    return this.game.moves.length > 0
  }

  get moves (): Point[] {
    return this.game.moves.slice(0, this.cursor)
  }
}

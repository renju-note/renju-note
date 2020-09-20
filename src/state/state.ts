import { Game, Board, BOARD_SIZE, Point } from '../rule'

export class State {
  readonly game: Game
  readonly board: Board
  readonly cursor: number

  constructor (init: {} | Pick<State, 'game' | 'board' | 'cursor'>) {
    if ('game' in init) {
      this.game = init.game
      this.board = init.board
      this.cursor = init.cursor
    } else {
      this.game = new Game({})
      this.board = new Board({ size: BOARD_SIZE })
      this.cursor = 0
    }
  }

  move (p: Point): State {
    if (!this.last) return this
    const game = this.game.move(p)
    if (game === undefined) return this
    return new State({
      game: game,
      board: generateBoard(game),
      cursor: this.cursor + 1,
    })
  }

  undo (): State {
    if (!this.last) return this
    const game = this.game.undo()
    if (game === undefined) return this
    return new State({
      game: game,
      board: generateBoard(game),
      cursor: this.cursor - 1,
    })
  }

  forward (): State {
    if (this.last) return this
    return new State({
      game: this.game,
      board: this.board.put(this.cursor % 2 === 0, this.game.moves[this.cursor]),
      cursor: this.cursor + 1,
    })
  }

  backward (): State {
    if (this.cursor === 0) return this
    return new State({
      game: this.game,
      board: this.board.remove(this.game.moves[this.cursor - 1]),
      cursor: this.cursor - 1,
    })
  }

  get last (): boolean {
    return this.cursor === this.game.moves.length
  }
}

const generateBoard = (g: Game): Board => new Board({
  size: BOARD_SIZE,
  blacks: g.blacks,
  whites: g.whites,
})

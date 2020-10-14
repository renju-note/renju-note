import { createContext, useState } from 'react'
import { Board, Game, N_LINES, Point } from '../rule'

export class AppState {
  readonly game: Game
  readonly cursor: number
  readonly board: Board

  constructor (init: {} | {code: string} | Pick<AppState, 'game' | 'cursor' | 'board'>) {
    if ('game' in init) {
      this.game = init.game
      this.cursor = init.cursor
      this.board = init.board
    } else if ('code' in init) {
      const codes = init.code.split('/')
      if (codes.length !== 2) throw new Error('invalid code')
      const [gameCode, cursorCode] = codes
      this.game = new Game({ code: gameCode })
      this.cursor = parseInt(cursorCode)
      this.board = new Board({ size: N_LINES, blacks: this.game.blacks, whites: this.game.whites })
    } else {
      this.game = new Game({})
      this.cursor = 0
      this.board = new Board({ size: N_LINES })
    }
  }

  move (p: Point): AppState {
    if (!this.canMove) return this
    if (this.game.isBlackTurn && this.board.forbidden(p)) return this

    const game = this.game.move(p)
    if (game === undefined) return this
    return new AppState({
      game: game,
      board: this.board.put(this.game.isBlackTurn, p),
      cursor: this.cursor + 1,
    })
  }

  undo (): AppState {
    if (!this.canUndo) return this

    const game = this.game.undo()
    if (game === undefined) return this
    return new AppState({
      game: game,
      board: this.board.remove(this.game.moves[this.game.moves.length - 1]),
      cursor: this.cursor - 1,
    })
  }

  reset (): AppState {
    if (!this.canReset) return this
    return new AppState({})
  }

  forward (): AppState {
    if (this.isLast) return this
    return new AppState({
      game: this.game,
      board: this.board.put(this.cursor % 2 === 0, this.game.moves[this.cursor]),
      cursor: this.cursor + 1,
    })
  }

  backward (): AppState {
    if (this.isStart) return this
    return new AppState({
      game: this.game,
      board: this.board.remove(this.game.moves[this.cursor - 1]),
      cursor: this.cursor - 1,
    })
  }

  jump (i: number): AppState {
    if (i < 0 || this.game.moves.length < i) return this
    const forked = this.game.fork(i)
    return new AppState({
      game: this.game,
      board: new Board({
        size: this.board.size,
        blacks: forked.blacks,
        whites: forked.whites,
      }),
      cursor: i,
    })
  }

  toStart (): AppState {
    return this.jump(0)
  }

  toLast (): AppState {
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

  get code (): string {
    return `${this.game.code}/${this.cursor}`
  }
}

export type SetAppState = (s: AppState) => void

export const useAppState = (): [AppState, SetAppState] => {
  const init = parseAppState(window.location.hash) || new AppState({})
  const [appState, setAppState] = useState<AppState>(init)

  const setAppStateAndHash = (s: AppState) => {
    setAppState(s)
    window.history.replaceState(null, '', `#${s.code}`)
  }
  return [appState, setAppStateAndHash]
}

export const AppStateContext = createContext<[AppState, SetAppState]>([new AppState({}), () => {}])

const parseAppState = (windowLocationHash: string): AppState | undefined => {
  try {
    return new AppState({ code: windowLocationHash.slice(1) })
  } catch (e) {
    console.log(`Invalid fragment: '${windowLocationHash}'`)
  }
}

import { createContext, useState } from 'react'
import { Board, Game, N_LINES, Point } from '../rule'

export const EditMode = {
  orderedMoves: 'orderedMoves',
  freeWhites: 'freeWhites',
  freeBlacks: 'freeBlacks',
  markerLines: 'markerLines',
  markerChars: 'markerChars',
} as const
export type EditMode = typeof EditMode[keyof typeof EditMode]

export class AppState {
  readonly mode: EditMode
  readonly gameState: GameState

  constructor (
    init:
      | {}
      | {code: string}
      | Pick<AppState, 'mode' | 'gameState'>
  ) {
    this.mode = 'mode' in init ? init.mode : 'orderedMoves'
    this.gameState = 'gameState' in init ? init.gameState : new GameState(init)
  }

  setMode (mode: EditMode): AppState {
    return new AppState({
      mode: mode,
      gameState: this.gameState,
    })
  }

  move (p: Point): AppState {
    return new AppState({
      mode: this.mode,
      gameState: this.gameState.move(p)
    })
  }

  undo (): AppState {
    return new AppState({
      mode: this.mode,
      gameState: this.gameState.undo()
    })
  }

  forward (): AppState {
    return new AppState({
      mode: this.mode,
      gameState: this.gameState.forward()
    })
  }

  backward (): AppState {
    return new AppState({
      mode: this.mode,
      gameState: this.gameState.backward()
    })
  }

  toStart (): AppState {
    return new AppState({
      mode: this.mode,
      gameState: this.gameState.toStart()
    })
  }

  toLast (): AppState {
    return new AppState({
      mode: this.mode,
      gameState: this.gameState.toLast()
    })
  }

  get board (): Board {
    return new Board({
      size: N_LINES,
      blacks: this.gameState.blacks,
      whites: this.gameState.whites,
    })
  }

  get canUndo (): boolean {
    return this.gameState.isLast && !this.gameState.isStart
  }

  get code (): string {
    return this.gameState.code
  }
}

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
    if (!this.isLast || this.isStart) return this
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

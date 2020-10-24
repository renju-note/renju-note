import { Board, N_LINES, Point } from '../rule'
import { GameState } from './gameState'

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

import { Board, equal, N_LINES, Point } from '../rule'
import { GameState } from './gameState'
import { FreeState } from './freeState'

export const EditMode = {
  mainMoves: 'mainMoves',
  freeWhites: 'freeWhites',
  freeBlacks: 'freeBlacks',
  markerAlphabets: 'markerAlphabets',
  markerLines: 'markerLines',
} as const
export type EditMode = typeof EditMode[keyof typeof EditMode]

export class AppState {
  readonly mode: EditMode
  readonly gameState: GameState
  readonly freeState: FreeState
  private boardCache: Board | undefined

  constructor (
    init:
      | {}
      | {code: string}
      | Pick<AppState, 'mode' | 'gameState' | 'freeState'>
  ) {
    this.mode = 'mode' in init ? init.mode : 'mainMoves'
    this.gameState = 'gameState' in init ? init.gameState : new GameState(init)
    this.freeState = 'freeState' in init ? init.freeState : new FreeState(init)
  }

  setMode (mode: EditMode): AppState {
    return this.replace({ mode: mode })
  }

  move (p: Point): AppState {
    switch (this.mode) {
      case EditMode.mainMoves:
        if (this.hasStone(p)) return this
        if (this.gameState.game.isBlackTurn && this.board.forbidden(p)) return this
        return this.replace({ gameState: this.gameState.move(p) })
      case EditMode.freeBlacks:
        if (this.hasStone(p)) return this
        return this.replace({ freeState: this.freeState.put(true, p) })
      case EditMode.freeWhites:
        if (this.hasStone(p)) return this
        return this.replace({ freeState: this.freeState.put(false, p) })
      default:
        return this
    }
  }

  undo (): AppState {
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.replace({ gameState: this.gameState.undo() })
      case EditMode.freeBlacks:
        return this.replace({ freeState: this.freeState.undo(true) })
      case EditMode.freeWhites:
        return this.replace({ freeState: this.freeState.undo(false) })
      default:
        return this
    }
  }

  resetFreeState (): AppState {
    return this.replace({ freeState: new FreeState({}) })
  }

  forward (): AppState {
    return this.replace({ gameState: this.gameState.forward() })
  }

  backward (): AppState {
    return this.replace({ gameState: this.gameState.backward() })
  }

  toStart (): AppState {
    return this.replace({ gameState: this.gameState.toStart() })
  }

  toLast (): AppState {
    return this.replace({ gameState: this.gameState.toLast() })
  }

  private replace (
    fields: Partial<Pick<AppState, 'mode' | 'gameState' | 'freeState'>>
  ): AppState {
    return new AppState({
      mode: fields.mode ?? this.mode,
      gameState: fields.gameState ?? this.gameState,
      freeState: fields.freeState ?? this.freeState,
    })
  }

  private hasStone (p: Point): boolean {
    return [...this.blacks, ...this.whites].findIndex(q => equal(p, q)) >= 0
  }

  get blacks (): Point[] {
    return [...this.gameState.blacks, ...this.freeState.blacks]
  }

  get whites (): Point[] {
    return [...this.gameState.whites, ...this.freeState.whites]
  }

  get board (): Board {
    if (this.boardCache === undefined) {
      console.log('computed board')
      this.boardCache = new Board({
        size: N_LINES,
        blacks: this.blacks,
        whites: this.whites,
      })
    }
    return this.boardCache
  }

  get canUndo (): boolean {
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.gameState.canUndo
      case EditMode.freeBlacks:
        return this.freeState.canUndo(true)
      case EditMode.freeWhites:
        return this.freeState.canUndo(false)
      default:
        return false
    }
  }

  get code (): string {
    return this.gameState.code
  }
}

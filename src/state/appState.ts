import { Board, equal, N_LINES, Point } from '../rule'
import { GameState } from './gameState'
import { FreeLinesState } from './freeLinesState'
import { FreePointsState } from './freePointsState'

export const EditMode = {
  mainMoves: 'mainMoves',
  freeWhites: 'freeWhites',
  freeBlacks: 'freeBlacks',
  markerPoints: 'markerPoints',
  markerLines: 'markerLines',
} as const
export type EditMode = typeof EditMode[keyof typeof EditMode]

export class AppState {
  readonly mode: EditMode
  readonly gameState: GameState
  readonly freeBlacks: FreePointsState
  readonly freeWhites: FreePointsState
  readonly markerPoints: FreePointsState
  readonly markerLines: FreeLinesState
  private boardCache: Board | undefined

  constructor (
    init:
      | {}
      | {code: string}
      | Pick<AppState, 'mode' | 'gameState' | 'freeBlacks' | 'freeWhites' | 'markerPoints' | 'markerLines'>
  ) {
    this.mode = 'mode' in init ? init.mode : EditMode.mainMoves
    this.gameState = 'gameState' in init ? init.gameState : new GameState(init)
    this.freeBlacks = 'freeBlacks' in init ? init.freeBlacks : new FreePointsState({})
    this.freeWhites = 'freeWhites' in init ? init.freeWhites : new FreePointsState({})
    this.markerPoints = 'markerPoints' in init ? init.markerPoints : new FreePointsState({})
    this.markerLines = 'markerLines' in init ? init.markerLines : new FreeLinesState({})
  }

  setMode (mode: EditMode): AppState {
    return this.update({ mode: mode })
  }

  click (p: Point): AppState {
    switch (this.mode) {
      case EditMode.mainMoves:
        if (this.hasStone(p)) return this
        if (this.gameState.game.isBlackTurn && this.board.forbidden(p)) return this
        return this.update({ gameState: this.gameState.move(p) })
      case EditMode.freeBlacks:
        if (this.hasStone(p)) return this
        return this.update({ freeBlacks: this.freeBlacks.add(p) })
      case EditMode.freeWhites:
        if (this.hasStone(p)) return this
        return this.update({ freeWhites: this.freeWhites.add(p) })
      case EditMode.markerPoints:
        if (this.hasStone(p)) return this
        return this.update({ markerPoints: this.markerPoints.add(p) })
      case EditMode.markerLines:
        return this.update({ markerLines: this.markerLines.draw(p) })
      default:
        return this
    }
  }

  undo (): AppState {
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.update({ gameState: this.gameState.undo() })
      case EditMode.freeBlacks:
        return this.update({ freeBlacks: this.freeBlacks.undo() })
      case EditMode.freeWhites:
        return this.update({ freeWhites: this.freeWhites.undo() })
      case EditMode.markerPoints:
        return this.update({ markerPoints: this.markerPoints.undo() })
      case EditMode.markerLines:
        return this.update({ markerLines: this.markerLines.undo() })
      default:
        return this
    }
  }

  forward (): AppState {
    return this.update({ gameState: this.gameState.forward() })
  }

  backward (): AppState {
    return this.update({ gameState: this.gameState.backward() })
  }

  toStart (): AppState {
    return this.update({ gameState: this.gameState.toStart() })
  }

  toLast (): AppState {
    return this.update({ gameState: this.gameState.toLast() })
  }

  clearFreeStones (): AppState {
    return this.update({
      freeBlacks: new FreePointsState({}),
      freeWhites: new FreePointsState({}),
    })
  }

  clearMarkers (): AppState {
    return this.update({
      markerPoints: new FreePointsState({})
    })
  }

  get blacks (): Point[] {
    return [...this.gameState.blacks, ...this.freeBlacks.points]
  }

  get whites (): Point[] {
    return [...this.gameState.whites, ...this.freeWhites.points]
  }

  get board (): Board {
    if (this.boardCache === undefined) {
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
        return this.freeBlacks.canUndo
      case EditMode.freeWhites:
        return this.freeWhites.canUndo
      case EditMode.markerPoints:
        return this.markerPoints.canUndo
      case EditMode.markerLines:
        return this.markerLines.canUndo
      default:
        return false
    }
  }

  get code (): string {
    return this.gameState.code
  }

  private update (
    fields:
      Partial<
        Pick<
          AppState,
          'mode' | 'gameState' | 'freeBlacks' | 'freeWhites' | 'markerPoints' | 'markerLines'
        >
      >
  ): AppState {
    return new AppState({
      mode: fields.mode ?? this.mode,
      gameState: fields.gameState ?? this.gameState,
      freeBlacks: fields.freeBlacks ?? this.freeBlacks,
      freeWhites: fields.freeWhites ?? this.freeWhites,
      markerPoints: fields.markerPoints ?? this.markerPoints,
      markerLines: fields.markerLines ?? this.markerLines,
    })
  }

  private hasStone (p: Point): boolean {
    return [...this.blacks, ...this.whites].findIndex(q => equal(p, q)) >= 0
  }
}

import { Board, equal, Game, N_LINES, Point } from '../rule'
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
  readonly game: Game
  readonly cursor: number
  readonly freeBlacks: FreePointsState
  readonly freeWhites: FreePointsState
  readonly markerPoints: FreePointsState
  readonly markerLines: FreeLinesState
  private boardCache: Board | undefined

  constructor (
    init:
      | {}
      | {code: string}
      | Pick<
          AppState,
          'mode' | 'game' | 'cursor' | 'freeBlacks' | 'freeWhites' | 'markerPoints' | 'markerLines'
        >
  ) {
    if ('mode' in init) {
      this.mode = init.mode
      this.game = init.game
      this.cursor = init.cursor
      this.freeBlacks = init.freeBlacks
      this.freeWhites = init.freeWhites
      this.markerPoints = init.markerPoints
      this.markerLines = init.markerLines
    } else if ('code' in init) {
      const codes = init.code.split('/')
      if (codes.length !== 2) throw new Error('invalid code')
      const [gameCode, cursorCode] = codes

      this.mode = EditMode.mainMoves
      this.game = new Game({ code: gameCode })
      this.cursor = parseInt(cursorCode)
      this.freeBlacks = new FreePointsState({})
      this.freeWhites = new FreePointsState({})
      this.markerPoints = new FreePointsState({})
      this.markerLines = new FreeLinesState({})
    } else {
      this.mode = EditMode.mainMoves
      this.game = new Game({})
      this.cursor = 0
      this.freeBlacks = new FreePointsState({})
      this.freeWhites = new FreePointsState({})
      this.markerPoints = new FreePointsState({})
      this.markerLines = new FreeLinesState({})
    }
  }

  setMode (mode: EditMode): AppState {
    return this.update({ mode: mode })
  }

  edit (p: Point): AppState {
    if (!this.canEdit(p)) return this
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.update({ game: this.game.move(p) }).toLast()
      case EditMode.freeBlacks:
        return this.update({ freeBlacks: this.freeBlacks.add(p) })
      case EditMode.freeWhites:
        return this.update({ freeWhites: this.freeWhites.add(p) })
      case EditMode.markerPoints:
        return this.update({ markerPoints: this.markerPoints.add(p) })
      case EditMode.markerLines:
        return this.update({ markerLines: this.markerLines.draw(p) })
      default:
        return this
    }
  }

  undo (): AppState {
    if (!this.canUndo) return this
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.update({ game: this.game.undo() }).toLast()
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
    return this.navigate(this.cursor + 1)
  }

  backward (): AppState {
    return this.navigate(this.cursor - 1)
  }

  toStart (): AppState {
    return this.navigate(0)
  }

  toLast (): AppState {
    return this.navigate(this.game.moves.length)
  }

  navigate (i: number): AppState {
    if (i < 0 || this.game.moves.length < i) return this
    return this.update({ cursor: i })
  }

  clearFreeStones (): AppState {
    return this.update({
      freeBlacks: new FreePointsState({}),
      freeWhites: new FreePointsState({}),
    })
  }

  clearMarkers (): AppState {
    return this.update({
      markerPoints: new FreePointsState({}),
      markerLines: new FreeLinesState({})
    })
  }

  canEdit (p: Point): boolean {
    switch (this.mode) {
      case EditMode.mainMoves:
        return (
          this.isLast &&
          !this.hasStone(p) &&
          !(this.game.isBlackTurn && this.board.forbidden(p))
        )
      case EditMode.freeBlacks:
        return (this.isLast && !this.hasStone(p))
      case EditMode.freeWhites:
        return (this.isLast && !this.hasStone(p))
      case EditMode.markerPoints:
        return !this.hasStone(p)
      case EditMode.markerLines:
        return true
      default:
        return false
    }
  }

  get canUndo (): boolean {
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.isLast && this.game.canUndo
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

  get moves (): Point[] {
    return this.partial.moves
  }

  get blacks (): Point[] {
    return [...this.partial.blacks, ...this.freeBlacks.points]
  }

  get whites (): Point[] {
    return [...this.partial.whites, ...this.freeWhites.points]
  }

  get partial (): Game {
    return this.game.fork(this.cursor)
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

  private update (
    fields:
      Partial<
        Pick<
          AppState,
          'mode' | 'game' | 'cursor' | 'freeBlacks' | 'freeWhites' | 'markerPoints' | 'markerLines'
        >
      >
  ): AppState {
    return new AppState({
      mode: fields.mode ?? this.mode,
      game: fields.game ?? this.game,
      cursor: fields.cursor ?? this.cursor,
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

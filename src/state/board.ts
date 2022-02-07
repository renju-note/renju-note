import { Board, makeBoard, Point } from 'renjukit'
import { GameState, PointsState, SegmentsState } from './common'

const boardModes = [
  'game',
  'freeBlacks',
  'freeWhites',
  'markerPoints',
  'markerLines',
  'preview',
] as const
export type BoardMode = typeof boardModes[number]
export const BoardMode: Record<BoardMode, BoardMode> = {
  game: 'game',
  freeBlacks: 'freeBlacks',
  freeWhites: 'freeWhites',
  markerPoints: 'markerPoints',
  markerLines: 'markerLines',
  preview: 'preview',
} as const

export class BoardState {
  readonly mode: BoardMode = BoardMode.game
  readonly game: GameState = new GameState()
  readonly freeBlacks: PointsState = new PointsState()
  readonly freeWhites: PointsState = new PointsState()
  readonly markerPoints: PointsState = new PointsState()
  readonly markerLines: SegmentsState = new SegmentsState()
  readonly markerPath: PointsState = new PointsState()
  readonly pathTurn: boolean = true
  private cache: Board | undefined

  constructor(init?: undefined | Partial<BoardState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<BoardState>): BoardState {
    return new BoardState({ ...this, ...fields, cache: undefined })
  }

  /* edit */

  private canEdit(p: Point): boolean {
    switch (this.mode) {
      case BoardMode.game:
        return this.canEditMove(p)
      case BoardMode.freeBlacks:
        return this.canEditFreeStone(p) && !this.freeWhites.has(p)
      case BoardMode.freeWhites:
        return this.canEditFreeStone(p) && !this.freeBlacks.has(p)
      case BoardMode.markerPoints:
        return true
      case BoardMode.markerLines:
        return true
      default:
        return false
    }
  }

  private canEditMove(p: Point): boolean {
    return this.game.canMove(p) && !this.freeBlacks.has(p) && !this.freeWhites.has(p)
  }

  private canEditFreeStone(p: Point): boolean {
    return this.game.isLast && !this.game.isBranching && !this.game.main.has(p)
  }

  edit(p: Point): BoardState {
    if (!this.canEdit(p)) return this
    switch (this.mode) {
      case BoardMode.game:
        return this.update({ game: this.game.move(p) })
      case BoardMode.freeBlacks:
        return this.update({ freeBlacks: this.freeBlacks.edit(p) })
      case BoardMode.freeWhites:
        return this.update({ freeWhites: this.freeWhites.edit(p) })
      case BoardMode.markerPoints:
        return this.update({ markerPoints: this.markerPoints.edit(p) })
      case BoardMode.markerLines:
        return this.update({ markerLines: this.markerLines.draw(p) })
      default:
        return this
    }
  }

  /* edit menu */

  setMode(mode: BoardMode): BoardState {
    return this.update({
      mode: mode,
      markerLines: mode === BoardMode.markerPoints ? this.markerLines : this.markerLines.unstart(),
    })
  }

  setGame(game: GameState): BoardState {
    return this.update({ game })
  }

  /* undo */

  get canUndo(): boolean {
    switch (this.mode) {
      case BoardMode.game:
        return this.game.canUndo
      case BoardMode.freeBlacks:
        return this.freeBlacks.canUndo
      case BoardMode.freeWhites:
        return this.freeWhites.canUndo
      case BoardMode.markerPoints:
        return this.markerPoints.canUndo
      case BoardMode.markerLines:
        return this.markerLines.canUndo
      default:
        return false
    }
  }

  undo(): BoardState {
    if (!this.canUndo) return this
    switch (this.mode) {
      case BoardMode.game:
        return this.update({ game: this.game.undo() })
      case BoardMode.freeBlacks:
        return this.update({ freeBlacks: this.freeBlacks.undo() })
      case BoardMode.freeWhites:
        return this.update({ freeWhites: this.freeWhites.undo() })
      case BoardMode.markerPoints:
        return this.update({ markerPoints: this.markerPoints.undo() })
      case BoardMode.markerLines:
        return this.update({ markerLines: this.markerLines.undo() })
      default:
        return this
    }
  }

  get canClearRestOfMoves(): boolean {
    return this.mode === BoardMode.game && !this.canUndo && this.game.canClearRest
  }

  get canClearMainGame(): boolean {
    return this.mode === BoardMode.game && !this.canUndo && this.game.isReadOnly
  }

  /* general */

  setMarkerPath(points: Point[]): BoardState {
    return this.update({ markerPath: new PointsState({ points }) })
  }

  setPathTurn(pathTurn: boolean): BoardState {
    return this.update({ pathTurn })
  }

  get current(): Board {
    if (this.cache === undefined) this.cache = makeBoard(this.blacks, this.whites)
    return this.cache
  }

  get blacks(): Point[] {
    return [...this.game.blacks, ...this.freeBlacks.points]
  }

  get whites(): Point[] {
    return [...this.game.whites, ...this.freeWhites.points]
  }

  /* encode */
  convertMovesToStones(): BoardState {
    return this.update({
      mode: BoardMode.game,
      game: new GameState(),
      freeBlacks: new PointsState({ points: this.blacks }),
      freeWhites: new PointsState({ points: this.whites }),
    })
  }

  /* encode */

  encode(): string {
    const codes: string[] = []
    const mainGameCode = this.game.encode()
    if (mainGameCode !== '') codes.push(mainGameCode)
    if (!this.freeBlacks.empty) codes.push(`b:${this.freeBlacks.encode()}`)
    if (!this.freeWhites.empty) codes.push(`w:${this.freeWhites.encode()}`)
    if (!this.markerPoints.empty) codes.push(`p:${this.markerPoints.encode()}`)
    if (!this.markerLines.empty) codes.push(`l:${this.markerLines.encode()}`)
    return codes.join(',')
  }

  static decode(code: string): BoardState | undefined {
    const codes = code.split(',')
    const find = (s: string) => codes.find(c => c.startsWith(s))?.replace(s, '') ?? ''
    const mainGameCode = `gid:${find('gid:')},g:${find('g:')},o:${find('o:')},c:${find('c:')}`
    const freeBlacksCode = find('b:')
    const freeWhitesCode = find('w:')
    const markerPointsCode = find('p:')
    const markerLinesCode = find('l:')
    return new BoardState({
      mode: BoardMode.game,
      game: GameState.decode(mainGameCode) ?? new GameState(),
      freeBlacks: PointsState.decode(freeBlacksCode) ?? new PointsState(),
      freeWhites: PointsState.decode(freeWhitesCode) ?? new PointsState(),
      markerPoints: PointsState.decode(markerPointsCode) ?? new PointsState(),
      markerLines: SegmentsState.decode(markerLinesCode) ?? new SegmentsState(),
    })
  }
}

import { Board, equal, Game, N_LINES, Point } from '../rule'
import { FreeLinesState } from './freeLinesState'
import { FreePointsState } from './freePointsState'

const editModes = [
  'mainMoves',
  'freeBlacks',
  'freeWhites',
  'markerPoints',
  'markerLines',
] as const
export type EditMode = typeof editModes[number]
export const EditMode: Record<EditMode, EditMode> = {
  mainMoves: editModes[0],
  freeBlacks: editModes[1],
  freeWhites: editModes[2],
  markerPoints: editModes[3],
  markerLines: editModes[4],
} as const

const appOptions = [
  'invertMoves',
  'labelMarkers',
] as const
export type AppOption = typeof appOptions[number]
export const AppOption = {
  invertMoves: appOptions[0],
  labelMarkers: appOptions[1],
} as const

export class AppState {
  readonly game: Game = new Game()
  readonly cursor: number = 0
  readonly mode: EditMode = EditMode.mainMoves
  readonly options: AppOption[] = []
  readonly freeBlacks: FreePointsState = new FreePointsState()
  readonly freeWhites: FreePointsState = new FreePointsState()
  readonly markerPoints: FreePointsState = new FreePointsState()
  readonly markerLines: FreeLinesState = new FreeLinesState()
  readonly previewingGame: Game | undefined = undefined
  private boardCache: Board | undefined

  constructor (init?: undefined | Partial<AppState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update (fields: Partial<AppState>): AppState {
    return new AppState({ ...this, ...fields })
  }

  setMode (mode: EditMode): AppState {
    return this.update({
      mode: mode,
      markerLines: mode === EditMode.markerPoints ? this.markerLines : this.markerLines.unstart(),
    })
  }

  setGame (game: Game): AppState {
    return this.update({
      game: game,
      cursor: game.moves.length,
      options: this.options.filter(o => o !== AppOption.invertMoves),
      freeBlacks: new FreePointsState(),
      freeWhites: new FreePointsState(),
    })
  }

  setPreviewingGame (game: Game): AppState {
    return this.update({
      previewingGame: game,
    })
  }

  setGameFromPreviewing (): AppState {
    if (this.previewingGame === undefined) return this
    return this.update({
      game: this.previewingGame,
      cursor: this.previewingGame.moves.length,
      previewingGame: undefined,
    })
  }

  unsetPreviewingGame (): AppState {
    return this.update({
      previewingGame: undefined,
    })
  }

  setOptions (options: AppOption[]): AppState {
    return this.update({ options: options })
  }

  hasOption (o: AppOption): boolean {
    return this.options.indexOf(o) >= 0
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

  clearFollowingMoves (): AppState {
    return this.update({
      game: this.partialGame,
    })
  }

  clearFreeStones (): AppState {
    return this.update({
      freeBlacks: new FreePointsState(),
      freeWhites: new FreePointsState(),
    })
  }

  clearMarkers (): AppState {
    return this.update({
      markerPoints: new FreePointsState(),
      markerLines: new FreeLinesState()
    })
  }

  canEdit (p: Point): boolean {
    if (this.previewingGame !== undefined) return false
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
    return this.partialGame.moves
  }

  get blackMoves (): Point[] {
    return this.hasOption(AppOption.invertMoves) ? this.partialGame.whites : this.partialGame.blacks
  }

  get whiteMoves (): Point[] {
    return this.hasOption(AppOption.invertMoves) ? this.partialGame.blacks : this.partialGame.whites
  }

  get blacks (): Point[] {
    return [...this.blackMoves, ...this.freeBlacks.points]
  }

  get whites (): Point[] {
    return [...this.whiteMoves, ...this.freeWhites.points]
  }

  get isStart (): boolean {
    return this.cursor === 0
  }

  get isLast (): boolean {
    return this.cursor === this.game.moves.length
  }

  private hasStone (p: Point): boolean {
    return [...this.blacks, ...this.whites].findIndex(q => equal(p, q)) >= 0
  }

  private get partialGame (): Game {
    return this.game.fork(this.cursor)
  }

  encode (): string {
    const codes: string[] = []
    if (!this.game.empty) codes.push(`g:${this.game.encode()}`)
    if (this.cursor !== 0) codes.push(`c:${this.cursor}`)
    if (this.options.length > 0) codes.push(`o:${this.options.map(shortName).join('')}`)
    if (!this.freeBlacks.empty) codes.push(`b:${this.freeBlacks.encode()}`)
    if (!this.freeWhites.empty) codes.push(`w:${this.freeWhites.encode()}`)
    if (!this.markerPoints.empty) codes.push(`p:${this.markerPoints.encode()}`)
    if (!this.markerLines.empty) codes.push(`l:${this.markerLines.encode()}`)
    return codes.join(',')
  }

  static decode (code: string): AppState | undefined {
    const codes = code.split(',')
    const findCode = (s: string) => codes.find(c => c.startsWith(s))?.replace(`${s}:`, '') ?? ''

    const gameCode = findCode('g')
    const cursorCode = findCode('c')
    const optionsCode = findCode('o')
    const freeBlacksCode = findCode('b')
    const freeWhitesCode = findCode('w')
    const markerPointsCode = findCode('p')
    const markerLinesCode = findCode('l')

    const game = Game.decode(gameCode) ?? new Game()
    const cursor = Math.min(game.moves.length, parseInt(cursorCode) || 0)
    return new AppState({
      game,
      cursor,
      mode: EditMode.mainMoves,
      options: optionsCode.split('').map(longName).filter(o => o !== undefined) as AppOption[],
      freeBlacks: FreePointsState.decode(freeBlacksCode) ?? new FreePointsState(),
      freeWhites: FreePointsState.decode(freeWhitesCode) ?? new FreePointsState(),
      markerPoints: FreePointsState.decode(markerPointsCode) ?? new FreePointsState(),
      markerLines: FreeLinesState.decode(markerLinesCode) ?? new FreeLinesState(),
      previewingGame: undefined,
    })
  }
}

const shortName = (o: AppOption): string => {
  switch (o) {
    case AppOption.invertMoves:
      return 'i'
    case AppOption.labelMarkers:
      return 'l'
  }
}

const longName = (s: string): AppOption | undefined => {
  switch (s) {
    case 'i':
      return AppOption.invertMoves
    case 'l':
      return AppOption.labelMarkers
  }
}

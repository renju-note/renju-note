import { Board, equal, Game, N_LINES, Point } from '../rule'
import { Options } from '../utils/options'
import { FreeLinesState } from './freeLines'
import { FreePointsState } from './freePoints'

const editModes = ['mainMoves', 'freeBlacks', 'freeWhites', 'markerPoints', 'markerLines'] as const
export type EditMode = typeof editModes[number]
export const EditMode: Record<EditMode, EditMode> = {
  mainMoves: editModes[0],
  freeBlacks: editModes[1],
  freeWhites: editModes[2],
  markerPoints: editModes[3],
  markerLines: editModes[4],
} as const

const boardOptions = ['invertMoves', 'labelMarkers'] as const
export type BoardOption = typeof boardOptions[number]
export const BoardOption: Record<BoardOption, BoardOption> = {
  invertMoves: boardOptions[0],
  labelMarkers: boardOptions[1],
} as const

export type BoardOptions = Options<BoardOption>

export class BoardState {
  readonly mainGame: Game = new Game()
  readonly cursor: number = 0
  readonly branch: Point[] = []
  readonly mode: EditMode = EditMode.mainMoves
  readonly options: BoardOptions = new Options<BoardOption>()
  readonly freeBlacks: FreePointsState = new FreePointsState()
  readonly freeWhites: FreePointsState = new FreePointsState()
  readonly markerPoints: FreePointsState = new FreePointsState()
  readonly markerLines: FreeLinesState = new FreeLinesState()
  readonly previewingGame: Game | undefined = undefined
  private boardCache: Board | undefined
  private gameCache: Game | undefined

  constructor(init?: undefined | Partial<BoardState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<BoardState>): BoardState {
    return new BoardState({ ...this, ...fields, boardCache: undefined, gameCache: undefined })
  }

  /* edit */

  private canEdit(p: Point): boolean {
    if (this.previewingGame !== undefined) return false
    switch (this.mode) {
      case EditMode.mainMoves:
        return !this.hasStone(p) && !(this.game.isBlackTurn && this.board.forbidden(p))
      case EditMode.freeBlacks:
        return this.isLast && !this.isForking && !this.mainGame.has(p) && !this.freeWhites.has(p)
      case EditMode.freeWhites:
        return this.isLast && !this.isForking && !this.mainGame.has(p) && !this.freeBlacks.has(p)
      case EditMode.markerPoints:
        return !this.hasStone(p)
      case EditMode.markerLines:
        return true
      default:
        return false
    }
  }

  edit(p: Point): BoardState {
    if (!this.canEdit(p)) return this
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.move(p)
      case EditMode.freeBlacks:
        return this.update({ freeBlacks: this.freeBlacks.edit(p) })
      case EditMode.freeWhites:
        return this.update({ freeWhites: this.freeWhites.edit(p) })
      case EditMode.markerPoints:
        return this.update({ markerPoints: this.markerPoints.edit(p) })
      case EditMode.markerLines:
        return this.update({ markerLines: this.markerLines.draw(p) })
      default:
        return this
    }
  }

  private move(p: Point): BoardState {
    if (this.isForking) {
      return this.update({ branch: [...this.branch, p] })
    } else if (!this.isLast && equal(p, this.mainGame.moves[this.cursor])) {
      return this.forward()
    } else if (!this.isLast || this.mainGame.finalized) {
      return this.update({ branch: [p] })
    } else {
      return this.update({ mainGame: this.mainGame.move(p) }).toLast()
    }
  }

  /* edit menu */

  setMode(mode: EditMode): BoardState {
    return this.update({
      mode: mode,
      markerLines: mode === EditMode.markerPoints ? this.markerLines : this.markerLines.unstart(),
    })
  }

  setOptions(options: BoardOption[]): BoardState {
    return this.update({ options: new Options<BoardOption>().on(options) })
  }

  clearGame(): BoardState {
    return this.setGame(new Game())
  }

  clearFreeStones(): BoardState {
    return this.update({
      freeBlacks: new FreePointsState(),
      freeWhites: new FreePointsState(),
    })
  }

  clearMarkers(): BoardState {
    return this.update({
      markerPoints: new FreePointsState(),
      markerLines: new FreeLinesState(),
    })
  }

  /* undo */

  get canUndo(): boolean {
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.isForking || (this.isLast && this.mainGame.canUndo)
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

  undo(): BoardState {
    if (!this.canUndo) return this
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.unmove()
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

  private unmove(): BoardState {
    if (this.isForking) {
      return this.update({ branch: this.branch.slice(0, this.branch.length - 1) })
    } else {
      return this.update({ mainGame: this.mainGame.undo() }).toLast()
    }
  }

  get canClearRest(): boolean {
    return (
      this.mode === EditMode.mainMoves &&
      !this.mainGame.finalized &&
      !this.isForking &&
      !this.isLast
    )
  }

  clearRestMoves(): BoardState {
    if (this.isLast) return this
    return this.setGame(this.game)
  }

  /* navigate */

  get isStart(): boolean {
    return this.cursor === 0
  }

  get isLast(): boolean {
    return this.cursor === this.mainGame.size
  }

  private navigate(i: number): BoardState {
    if (i < 0 || this.mainGame.size < i) return this
    return this.update({ cursor: i })
  }

  get canForward() {
    return !this.isForking && !this.isLast
  }

  forward(): BoardState {
    if (!this.canForward) return this
    return this.navigate(this.cursor + 1)
  }

  toLast(): BoardState {
    if (!this.canForward) return this
    return this.navigate(this.mainGame.size)
  }

  get canBackward() {
    return !this.isForking && !this.isStart
  }

  backward(): BoardState {
    if (!this.canBackward) return this
    return this.navigate(this.cursor - 1)
  }

  toStart(): BoardState {
    if (!this.canBackward) return this
    return this.navigate(0)
  }

  /* fork */

  get isForking(): boolean {
    return this.branch.length > 0
  }

  clearForkingMoves(): BoardState {
    return this.update({
      branch: [],
    })
  }

  setGameFromForking(): BoardState {
    if (!this.isForking) return this
    return this.setGame(this.game)
  }

  /* preview */

  setGameFromPreviewing(): BoardState {
    if (this.previewingGame === undefined) return this
    return this.setGame(this.previewingGame)
  }

  setPreviewingGame(game: Game): BoardState {
    return this.update({
      previewingGame: game,
    })
  }

  unsetPreviewingGame(): BoardState {
    return this.update({
      previewingGame: undefined,
    })
  }

  /* general */

  get board(): Board {
    if (this.boardCache === undefined) {
      this.boardCache = new Board({
        size: N_LINES,
        blacks: this.blacks,
        whites: this.whites,
      })
    }
    return this.boardCache
  }

  get game(): Game {
    if (this.gameCache === undefined) {
      this.gameCache = new Game({
        moves: [...this.mainGame.moves.slice(0, this.cursor), ...this.branch],
      })
    }
    return this.gameCache
  }

  get blackMoves(): Point[] {
    return this.options.has(BoardOption.invertMoves) ? this.game.whites : this.game.blacks
  }

  get whiteMoves(): Point[] {
    return this.options.has(BoardOption.invertMoves) ? this.game.blacks : this.game.whites
  }

  get blacks(): Point[] {
    return [...this.blackMoves, ...this.freeBlacks.points]
  }

  get whites(): Point[] {
    return [...this.whiteMoves, ...this.freeWhites.points]
  }

  private hasStone(p: Point): boolean {
    return this.game.has(p) || this.freeWhites.has(p) || this.freeBlacks.has(p)
  }

  private setGame(game: Game): BoardState {
    return new BoardState({
      mainGame: game,
      cursor: game.size,
      branch: [],
    })
  }

  /* encode */

  encode(): string {
    const codes: string[] = []
    if (this.mainGame.gid !== undefined) codes.push(`gid:${this.mainGame.gid}`)
    if (this.cursor !== 0) codes.push(`c:${this.cursor}`)
    if (!this.mainGame.empty) codes.push(`g:${this.mainGame.encode()}`)
    if (!this.options.empty) codes.push(`o:${encodeBoardOptions(this.options)}`)
    if (!this.freeBlacks.empty) codes.push(`b:${this.freeBlacks.encode()}`)
    if (!this.freeWhites.empty) codes.push(`w:${this.freeWhites.encode()}`)
    if (!this.markerPoints.empty) codes.push(`p:${this.markerPoints.encode()}`)
    if (!this.markerLines.empty) codes.push(`l:${this.markerLines.encode()}`)
    return codes.join(',')
  }

  static decode(code: string): BoardState | undefined {
    const codes = code.split(',')
    const findCode = (s: string) =>
      codes.find(c => c.startsWith(`${s}:`))?.replace(`${s}:`, '') ?? ''

    const gameCode = findCode('g')
    const gidCode = findCode('gid')
    const cursorCode = findCode('c')
    const optionsCode = findCode('o')
    const freeBlacksCode = findCode('b')
    const freeWhitesCode = findCode('w')
    const markerPointsCode = findCode('p')
    const markerLinesCode = findCode('l')

    let mainGame = Game.decode(gameCode) ?? new Game()
    if (gidCode) mainGame = mainGame.setGid(parseInt(gidCode) || undefined)
    const cursor = Math.min(mainGame.size, parseInt(cursorCode) || 0)
    return new BoardState({
      mainGame,
      cursor,
      mode: EditMode.mainMoves,
      options: decodeBoardOptions(optionsCode) ?? new Options<BoardOption>(),
      freeBlacks: FreePointsState.decode(freeBlacksCode) ?? new FreePointsState(),
      freeWhites: FreePointsState.decode(freeWhitesCode) ?? new FreePointsState(),
      markerPoints: FreePointsState.decode(markerPointsCode) ?? new FreePointsState(),
      markerLines: FreeLinesState.decode(markerLinesCode) ?? new FreeLinesState(),
      previewingGame: undefined,
    })
  }
}

const encodeBoardOptions = (options: BoardOptions): string => {
  return options.values.map(shortName).join('')
}

const decodeBoardOptions = (code: string): BoardOptions => {
  const values = code
    .split('')
    .map(longName)
    .filter(v => v !== undefined) as BoardOption[]
  return new Options<BoardOption>().on(values)
}

const shortName = (o: BoardOption): string | undefined => {
  switch (o) {
    case BoardOption.invertMoves:
      return 'i'
    case BoardOption.labelMarkers:
      return 'l'
  }
}

const longName = (s: string): BoardOption | undefined => {
  switch (s) {
    case 'i':
      return BoardOption.invertMoves
    case 'l':
      return BoardOption.labelMarkers
  }
}

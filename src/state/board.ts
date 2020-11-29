import { Board, Game, N_LINES, Point } from '../rule'
import { Options } from '../utils/options'
import { FreeLinesState } from './freeLines'
import { FreePointsState } from './freePoints'
import { GameState } from './game'

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
  readonly mode: EditMode = EditMode.mainMoves
  readonly options: BoardOptions = new Options<BoardOption>()
  readonly gameState: GameState = new GameState()
  readonly freeBlacks: FreePointsState = new FreePointsState()
  readonly freeWhites: FreePointsState = new FreePointsState()
  readonly markerPoints: FreePointsState = new FreePointsState()
  readonly markerLines: FreeLinesState = new FreeLinesState()
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
      case EditMode.mainMoves:
        return this.gameState.canMove(p) && !(this.game.isBlackTurn && this.board.forbidden(p))
      case EditMode.freeBlacks:
        return this.canEditFreeStone(p) && !this.freeWhites.has(p)
      case EditMode.freeWhites:
        return this.canEditFreeStone(p) && !this.freeBlacks.has(p)
      case EditMode.markerPoints:
        return true
      case EditMode.markerLines:
        return true
      default:
        return false
    }
  }

  private canEditFreeStone(p: Point): boolean {
    return this.isLast && !this.isForking && !this.game.has(p)
  }

  edit(p: Point): BoardState {
    if (!this.canEdit(p)) return this
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.update({ gameState: this.gameState.move(p) })
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

  clearMoves(): BoardState {
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

  undo(): BoardState {
    if (!this.canUndo) return this
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

  get canClearRestOfMoves(): boolean {
    return this.mode === EditMode.mainMoves && !this.canUndo && this.gameState.canClearRest
  }

  clearRestOfMoves(): BoardState {
    if (!this.canClearRestOfMoves) return this
    return this.update({ gameState: this.gameState.clearRest() })
  }

  get canClearGame(): boolean {
    return this.mode === EditMode.mainMoves && !this.canUndo && this.gameState.isReadOnly
  }

  clearGame(): BoardState {
    if (!this.canClearGame) return this
    return this.update({ gameState: new GameState() })
  }

  /* navigate */

  get isStart(): boolean {
    return this.gameState.isStart
  }

  get isLast(): boolean {
    return this.gameState.isLast
  }

  get canForward() {
    return this.gameState.canForward
  }

  forward(): BoardState {
    if (!this.canForward) return this
    return this.update({ gameState: this.gameState.forward() })
  }

  toLast(): BoardState {
    if (!this.canForward) return this
    return this.update({ gameState: this.gameState.toLast() })
  }

  get canBackward() {
    return this.gameState.canBackward
  }

  backward(): BoardState {
    if (!this.canBackward) return this
    return this.update({ gameState: this.gameState.backward() })
  }

  toStart(): BoardState {
    if (!this.canBackward) return this
    return this.update({ gameState: this.gameState.toStart() })
  }

  /* fork */

  get isForking(): boolean {
    return this.gameState.isBranching
  }

  clearForkingMoves(): BoardState {
    return this.update({ gameState: this.gameState.clearBranch() })
  }

  /* general */

  get board(): Board {
    if (this.cache === undefined) {
      this.cache = new Board({
        size: N_LINES,
        blacks: this.blacks,
        whites: this.whites,
      })
    }
    return this.cache
  }

  get game(): Game {
    return this.gameState.game
  }

  get blacks(): Point[] {
    return [...(this.inverted ? this.game.whites : this.game.blacks), ...this.freeBlacks.points]
  }

  get whites(): Point[] {
    return [...(this.inverted ? this.game.blacks : this.game.whites), ...this.freeWhites.points]
  }

  private get inverted(): boolean {
    return this.options.has(BoardOption.invertMoves)
  }

  setGame(game: Game, gameid?: number | undefined): BoardState {
    return this.update({ gameState: new GameState({ main: game, gameid }).toLast() })
  }

  /* encode */

  encode(): string {
    const codes: string[] = []
    if (this.gameState.gameid !== undefined) codes.push(`gid:${this.gameState.gameid}`)
    if (this.gameState.cursor !== 0) codes.push(`c:${this.gameState.cursor}`)
    if (!this.gameState.main.empty) codes.push(`g:${this.gameState.main.encode()}`)
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

    const game = Game.decode(gameCode) ?? new Game()
    return new BoardState({
      mode: EditMode.mainMoves,
      options: decodeBoardOptions(optionsCode) ?? new Options<BoardOption>(),
      gameState: new GameState({
        main: game,
        cursor: Math.min(game.size, parseInt(cursorCode) || 0),
        gameid: parseInt(gidCode) || undefined,
      }),
      freeBlacks: FreePointsState.decode(freeBlacksCode) ?? new FreePointsState(),
      freeWhites: FreePointsState.decode(freeWhitesCode) ?? new FreePointsState(),
      markerPoints: FreePointsState.decode(markerPointsCode) ?? new FreePointsState(),
      markerLines: FreeLinesState.decode(markerLinesCode) ?? new FreeLinesState(),
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

import { Board, N_LINES, Point } from '../rule'
import { GameState, LinesState, OptionsState, PointsState } from './common'

const editModes = ['mainMoves', 'freeBlacks', 'freeWhites', 'markerPoints', 'markerLines'] as const
export type EditMode = typeof editModes[number]
export const EditMode: Record<EditMode, EditMode> = {
  mainMoves: 'mainMoves',
  freeBlacks: 'freeBlacks',
  freeWhites: 'freeWhites',
  markerPoints: 'markerPoints',
  markerLines: 'markerLines',
} as const

const boardOptions = ['invertMoves', 'labelMarkers'] as const
export type BoardOption = typeof boardOptions[number]
export const BoardOption: Record<BoardOption, BoardOption> = {
  invertMoves: 'invertMoves',
  labelMarkers: 'labelMarkers',
} as const

export type BoardOptionsState = OptionsState<BoardOption>

export class BoardState {
  readonly mode: EditMode = EditMode.mainMoves
  readonly options: BoardOptionsState = new OptionsState<BoardOption>()
  readonly mainGame: GameState = new GameState()
  readonly freeBlacks: PointsState = new PointsState()
  readonly freeWhites: PointsState = new PointsState()
  readonly markerPoints: PointsState = new PointsState()
  readonly markerLines: LinesState = new LinesState()
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
        return this.canEditMove(p)
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

  private canEditMove(p: Point): boolean {
    const isBlackTurn = this.inverted ? !this.mainGame.isBlackTurn : this.mainGame.isBlackTurn
    return (
      this.mainGame.canMove(p) &&
      !this.freeBlacks.has(p) &&
      !this.freeWhites.has(p) &&
      !(isBlackTurn && this.current.forbidden(p))
    )
  }

  private canEditFreeStone(p: Point): boolean {
    return this.mainGame.isLast && !this.mainGame.isBranching && !this.mainGame.main.has(p)
  }

  edit(p: Point): BoardState {
    if (!this.canEdit(p)) return this
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.update({ mainGame: this.mainGame.move(p) })
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
    return this.update({ options: new OptionsState<BoardOption>().on(options) })
  }

  setMainGame(mainGame: GameState): BoardState {
    return this.update({ mainGame })
  }

  clearMoves(): BoardState {
    return this.update({
      mainGame: new GameState(),
    })
  }

  clearFreeStones(): BoardState {
    return this.update({
      freeBlacks: new PointsState(),
      freeWhites: new PointsState(),
    })
  }

  clearMarkers(): BoardState {
    return this.update({
      markerPoints: new PointsState(),
      markerLines: new LinesState(),
    })
  }

  /* undo */

  get canUndo(): boolean {
    switch (this.mode) {
      case EditMode.mainMoves:
        return this.mainGame.canUndo
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
        return this.update({ mainGame: this.mainGame.undo() })
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
    return this.mode === EditMode.mainMoves && !this.canUndo && this.mainGame.canClearRest
  }

  get canClearMainGame(): boolean {
    return this.mode === EditMode.mainMoves && !this.canUndo && this.mainGame.isReadOnly
  }

  /* general */

  get current(): Board {
    if (this.cache === undefined) {
      this.cache = new Board({
        size: N_LINES,
        blacks: this.blacks,
        whites: this.whites,
      })
    }
    return this.cache
  }

  get blacks(): Point[] {
    return [
      ...(this.inverted ? this.mainGame.whites : this.mainGame.blacks),
      ...this.freeBlacks.points,
    ]
  }

  get whites(): Point[] {
    return [
      ...(this.inverted ? this.mainGame.blacks : this.mainGame.whites),
      ...this.freeWhites.points,
    ]
  }

  private get inverted(): boolean {
    return this.options.has(BoardOption.invertMoves)
  }

  /* encode */

  encode(): string {
    const codes: string[] = []
    const mainGameCode = this.mainGame.encode()
    if (mainGameCode !== '') codes.push(mainGameCode)
    if (!this.options.empty) codes.push(`o:${encodeBoardOptions(this.options)}`)
    if (!this.freeBlacks.empty) codes.push(`b:${this.freeBlacks.encode()}`)
    if (!this.freeWhites.empty) codes.push(`w:${this.freeWhites.encode()}`)
    if (!this.markerPoints.empty) codes.push(`p:${this.markerPoints.encode()}`)
    if (!this.markerLines.empty) codes.push(`l:${this.markerLines.encode()}`)
    return codes.join(',')
  }

  static decode(code: string): BoardState | undefined {
    const codes = code.split(',')
    const find = (s: string) => codes.find(c => c.startsWith(s))?.replace(s, '') ?? ''
    const optionsCode = find('o:')
    const mainGameCode = `gid:${find('gid:')},g:${find('g:')},c:${find('c:')}`
    const freeBlacksCode = find('b:')
    const freeWhitesCode = find('w:')
    const markerPointsCode = find('p:')
    const markerLinesCode = find('l:')
    return new BoardState({
      mode: EditMode.mainMoves,
      options: decodeBoardOptions(optionsCode) ?? new OptionsState<BoardOption>(),
      mainGame: GameState.decode(mainGameCode) ?? new GameState(),
      freeBlacks: PointsState.decode(freeBlacksCode) ?? new PointsState(),
      freeWhites: PointsState.decode(freeWhitesCode) ?? new PointsState(),
      markerPoints: PointsState.decode(markerPointsCode) ?? new PointsState(),
      markerLines: LinesState.decode(markerLinesCode) ?? new LinesState(),
    })
  }
}

const encodeBoardOptions = (options: BoardOptionsState): string => {
  const shortName = (o: string): string => o[0]
  return options.values.map(shortName).join('')
}

const decodeBoardOptions = (code: string): BoardOptionsState => {
  const longName = (s: string): BoardOption | undefined => boardOptions.find(o => o.startsWith(s))
  const values = code
    .split('')
    .map(longName)
    .filter(v => v !== undefined) as BoardOption[]
  return new OptionsState<BoardOption>().on(values)
}

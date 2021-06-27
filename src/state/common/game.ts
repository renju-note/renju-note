import { equal, Game, Point } from '../../rule'

export class GameState {
  readonly main: Game = new Game()
  readonly cursor: number = 0
  readonly branch: Point[] = []
  readonly gameid: number | undefined

  constructor(init?: undefined | Partial<GameState>) {
    if (init !== undefined) {
      Object.assign(this, init)
      if (!('cursor' in init)) this.cursor = this.main.size
    }
  }

  private update(fields: Partial<GameState>): GameState {
    return new GameState({ ...this, ...fields, cache: undefined })
  }

  canMove(p: Point): boolean {
    return !this.current.has(p)
  }

  move(p: Point): GameState {
    if (!this.canMove(p)) return this
    if (this.isBranching) {
      return this.moveBranch(p)
    } else if (!this.isLast && equal(p, this.main.moves[this.cursor])) {
      return this.forward()
    } else if (!this.isLast || this.isReadOnly) {
      return this.moveBranch(p)
    } else {
      return this.moveMain(p)
    }
  }

  get canUndo(): boolean {
    return this.isBranching || (!this.isReadOnly && this.isLast && !this.main.empty)
  }

  undo(): GameState {
    if (!this.canUndo) return this
    if (this.isBranching) {
      return this.undoBranch()
    } else {
      return this.undoMain()
    }
  }

  get canClearRest(): boolean {
    return !this.isBranching && !this.isReadOnly && !this.isLast
  }

  clearRest(): GameState {
    if (!this.canClearRest) return this
    return this.update({ main: this.main.cut(this.cursor) }).toLast()
  }

  /* main game */

  private moveMain(p: Point): GameState {
    return this.update({ main: this.main.move(p) }).toLast()
  }

  private undoMain(): GameState {
    return this.update({ main: this.main.undo() }).toLast()
  }

  /* navigate */

  get isStart(): boolean {
    return this.cursor === 0
  }

  get isLast(): boolean {
    return this.cursor === this.main.size
  }

  get canForward() {
    return !this.isBranching && !this.isLast
  }

  forward(): GameState {
    if (!this.canForward) return this
    return this.navigate(this.cursor + 1)
  }

  toLast(): GameState {
    if (!this.canForward) return this
    return this.navigate(this.main.size)
  }

  get canBackward() {
    return !this.isBranching && !this.isStart
  }

  backward(): GameState {
    if (!this.canBackward) return this
    return this.navigate(this.cursor - 1)
  }

  toStart(): GameState {
    if (!this.canBackward) return this
    return this.navigate(0)
  }

  private navigate(i: number): GameState {
    if (i < 0 || this.main.size < i) return this
    return this.update({ cursor: i })
  }

  /* branch */

  get isBranching(): boolean {
    return this.branch.length > 0
  }

  private moveBranch(p: Point): GameState {
    return this.update({ branch: [...this.branch, p] })
  }

  private undoBranch(): GameState {
    return this.update({ branch: this.branch.slice(0, this.branch.length - 1) })
  }

  clearBranch(): GameState {
    return this.update({ branch: [] })
  }

  newFromBranch(): GameState {
    return new GameState({ main: this.current, cursor: this.current.size })
  }

  invertMoves(inverted: boolean): GameState {
    return this.update({
      main: this.main.invert(inverted),
      gameid: undefined,
    })
  }

  /* current game */

  get current(): Game {
    return new Game({
      moves: [...this.main.cut(this.cursor).moves, ...this.branch],
      inverted: this.main.inverted,
    })
  }

  get blacks(): Point[] {
    return this.current.blacks
  }

  get whites(): Point[] {
    return this.current.whites
  }

  get isBlackTurn(): boolean {
    return this.current.isBlackTurn
  }

  get isReadOnly(): boolean {
    return this.gameid !== undefined
  }

  encode(): string {
    const codes: string[] = []
    if (this.gameid !== undefined) codes.push(`gid:${this.gameid}`)
    if (!this.main.empty) codes.push(`g:${this.main.encode()}`)
    if (this.main.inverted) codes.push(`o:i`)
    if (this.cursor !== 0) codes.push(`c:${this.cursor}`)
    return codes.join(',')
  }

  static decode(code: string): GameState | undefined {
    const codes = code.split(',')
    const find = (s: string) => codes.find(c => c.startsWith(s))?.replace(s, '') ?? ''
    const gameCode = find('g:')
    const cursorCode = find('c:')
    const gidCode = find('gid:')
    const invertedCode = find('o:')
    const main = (Game.decode(gameCode) ?? new Game()).invert(invertedCode.includes('i'))
    const cursor = Math.min(main.size, parseInt(cursorCode) || 0)
    const gameid = parseInt(gidCode) || undefined
    return new GameState({ main, cursor, gameid })
  }
}

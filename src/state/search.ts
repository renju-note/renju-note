import { Point } from '../rule'
import { GameState } from './common'

type SearchQuery = {
  moves?: Point[]
  playerId?: number
  limit: number
  offset: number
}

const DEFAULT_PAGE_SIZE = 20

export class PagerState {
  readonly hit: number = 0
  readonly page: number = 0
  readonly pageSize: number = DEFAULT_PAGE_SIZE

  constructor(init?: undefined | Partial<PagerState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<PagerState>): PagerState {
    return new PagerState({ ...this, ...fields })
  }

  get lastPage(): number {
    return ~~((this.hit - 1) / this.pageSize)
  }

  private navigate(page: number): PagerState {
    if (page < 0 || this.lastPage < page) return this
    return this.update({ page })
  }

  get isFirst(): boolean {
    return this.page === 0
  }

  get isLast(): boolean {
    return this.page === this.lastPage
  }

  next(): PagerState {
    if (this.isLast) return this
    return this.navigate(this.page + 1)
  }

  toLast(): PagerState {
    if (this.isLast) return this
    return this.navigate(this.lastPage)
  }

  prev(): PagerState {
    if (this.isFirst) return this
    return this.navigate(this.page - 1)
  }

  toFirst(): PagerState {
    if (this.isFirst) return this
    return this.navigate(0)
  }

  toString(): string {
    const start = this.page * this.pageSize + 1
    const last = Math.min((this.page + 1) * this.pageSize, this.hit)
    return `${start}-${last} of ${this.hit}`
  }
}

export class SearchState {
  readonly boardMoves: Point[] = []
  readonly followMoves: boolean = true
  readonly playerId?: number
  readonly pager: PagerState = new PagerState()
  readonly result: number[] = []
  readonly hiddenGame: GameState | undefined

  constructor(init?: undefined | Partial<SearchState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<SearchState>): SearchState {
    return new SearchState({ ...this, ...fields })
  }

  setBoardMoves(ps: Point[]): SearchState {
    let next = this.update({ boardMoves: ps })
    if (this.followMoves && this.boardMoves.toString() !== next.boardMoves.toString())
      next = next.resetPager()
    return next
  }

  setFollowMoves(on: boolean): SearchState {
    let next = this.update({ followMoves: on })
    if (this.followMoves !== next.followMoves) next = next.resetPager()
    return next
  }

  setPlayerId(id: number | undefined): SearchState {
    let next = this.update({ playerId: id })
    if (this.playerId !== next.playerId) next = next.resetPager()
    return next
  }

  setPager(pager: PagerState): SearchState {
    return this.update({ pager })
  }

  resetPager(): SearchState {
    return this.update({ pager: new PagerState() })
  }

  get query(): SearchQuery {
    return {
      moves: this.followMoves && this.boardMoves.length > 0 ? this.boardMoves : undefined,
      playerId: this.playerId,
      limit: this.pager.pageSize,
      offset: this.pager.page * this.pager.pageSize,
    }
  }

  setHitAndResult(hit: number, result: number[]): SearchState {
    const pager = new PagerState({ hit, page: this.pager.page })
    return this.update({ result, pager })
  }

  setHiddenGame(game: GameState | undefined): SearchState {
    return this.update({ hiddenGame: game })
  }
}

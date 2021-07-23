import { Point } from '../rule'

type SearchQuery = {
  moves: Point[] | undefined
  playerId: number | undefined
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
  readonly moves: Point[] = []
  readonly useMoves: boolean = true
  readonly playerId?: number
  readonly pager: PagerState = new PagerState()
  readonly gameIds: number[] = []

  constructor(init?: undefined | Partial<SearchState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<SearchState>): SearchState {
    return new SearchState({ ...this, ...fields })
  }

  setMoves(ps: Point[]): SearchState {
    let next = this.update({ moves: ps })
    if (this.useMoves && this.moves.toString() !== next.moves.toString()) next = next.resetPager()
    return next
  }

  setUseMoves(on: boolean): SearchState {
    let next = this.update({ useMoves: on })
    if (this.useMoves !== next.useMoves) next = next.resetPager()
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
      moves: this.useMoves && this.moves.length > 0 ? this.moves : undefined,
      playerId: this.playerId,
      limit: this.pager.pageSize,
      offset: this.pager.page * this.pager.pageSize,
    }
  }

  setResult(hit: number, gameIds: number[]): SearchState {
    const pager = new PagerState({ hit, page: this.pager.page })
    return this.update({ gameIds, pager })
  }
}

import { Point } from '../rule'
import { PagerState } from './pager'

type SearchQuery = {
  moves: Point[] | undefined
  playerId: number | undefined
  limit: number
  offset: number
}

export class SearchState {
  readonly moves: Point[] = []
  readonly useMoves: boolean = true
  readonly playerId?: number
  readonly pager: PagerState = new PagerState()
  readonly gameIds: number[] = []
  readonly error?: string

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

  setResult(hit: number, gameIds: number[], error?: string): SearchState {
    const pager = new PagerState({ hit, page: this.pager.page })
    return this.update({ gameIds, pager, error })
  }
}

import { Point } from 'renjukit'

type SearchQuery = {
  moves: Point[] | undefined
  playerId: number | undefined
}

export class SearchQueryState {
  readonly moves: Point[] = []
  readonly useMoves: boolean = true
  readonly playerId?: number

  constructor(init?: undefined | Partial<SearchQueryState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<SearchQueryState>): SearchQueryState {
    return new SearchQueryState({ ...this, ...fields })
  }

  setMoves(ps: Point[]): SearchQueryState {
    return this.update({ moves: ps })
  }

  setUseMoves(on: boolean): SearchQueryState {
    return this.update({ useMoves: on })
  }

  setPlayerId(id: number | undefined): SearchQueryState {
    return this.update({ playerId: id })
  }

  get query(): SearchQuery {
    return {
      moves: this.useMoves && this.moves.length > 0 ? this.moves : undefined,
      playerId: this.playerId,
    }
  }
}

export class SearchResultState {
  readonly hit: number = 0
  readonly gameIds: number[] = []
  readonly error?: string

  constructor(init?: undefined | Partial<SearchResultState>) {
    if (init !== undefined) Object.assign(this, init)
  }
}

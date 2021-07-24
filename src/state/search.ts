import { Point } from '../rule'

type SearchQuery = {
  moves: Point[] | undefined
  playerId: number | undefined
}

export class SearchState {
  readonly moves: Point[] = []
  readonly useMoves: boolean = true
  readonly playerId?: number
  readonly hit: number = 0
  readonly gameIds: number[] = []
  readonly error?: string

  constructor(init?: undefined | Partial<SearchState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<SearchState>): SearchState {
    return new SearchState({ ...this, ...fields })
  }

  setMoves(ps: Point[]): SearchState {
    return this.update({ moves: ps })
  }

  setUseMoves(on: boolean): SearchState {
    return this.update({ useMoves: on })
  }

  setPlayerId(id: number | undefined): SearchState {
    return this.update({ playerId: id })
  }

  get query(): SearchQuery {
    return {
      moves: this.useMoves && this.moves.length > 0 ? this.moves : undefined,
      playerId: this.playerId,
    }
  }

  setResult(hit: number, gameIds: number[], error?: string): SearchState {
    return this.update({ hit, gameIds, error })
  }
}

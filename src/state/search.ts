import { Point } from '../rule'
import { GameState } from './common'

export class SearchState {
  readonly boardMoves: Point[] = []
  readonly followMoves: boolean = true
  readonly playerId?: number
  readonly hiddenGame: GameState | undefined

  constructor(init?: undefined | Partial<SearchState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<SearchState>): SearchState {
    return new SearchState({ ...this, ...fields })
  }

  setBoardMoves(ps: Point[]): SearchState {
    return this.update({ boardMoves: ps })
  }

  setFollowMoves(on: boolean): SearchState {
    return this.update({ followMoves: on })
  }

  get moves(): Point[] | undefined {
    return this.followMoves && this.boardMoves.length > 0 ? this.boardMoves : undefined
  }

  setPlayerId(id: number | undefined): SearchState {
    return this.update({ playerId: id })
  }

  setHiddenGame(game: GameState | undefined): SearchState {
    return this.update({ hiddenGame: game })
  }
}

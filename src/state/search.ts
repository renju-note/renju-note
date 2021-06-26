import { GameState } from './common'

export class SearchState {
  readonly hiddenGame: GameState | undefined
  readonly followMoves: boolean = true
  readonly playerId?: number

  constructor(init?: undefined | Partial<SearchState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<SearchState>): SearchState {
    return new SearchState({ ...this, ...fields })
  }

  setHiddenGame(gameState: GameState | undefined): SearchState {
    return this.update({ hiddenGame: gameState })
  }

  setPlayerId(id: number | undefined): SearchState {
    return this.update({ playerId: id })
  }

  setFollowMoves(on: boolean): SearchState {
    return this.update({ followMoves: on })
  }
}

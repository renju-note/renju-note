import { GameState } from './common'

export class AdvancedState {
  readonly hiddenGame: GameState | undefined
  readonly searchPlayerId?: number
  readonly searchWithMoves: boolean = true

  constructor(init?: undefined | Partial<AdvancedState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<AdvancedState>): AdvancedState {
    return new AdvancedState({ ...this, ...fields })
  }

  setHiddenGame(gameState: GameState | undefined): AdvancedState {
    return this.update({ hiddenGame: gameState })
  }

  setSearchPlayerId(id: number | undefined): AdvancedState {
    return this.update({ searchPlayerId: id })
  }

  setSearchWithMoves(on: boolean): AdvancedState {
    return this.update({ searchWithMoves: on })
  }
}

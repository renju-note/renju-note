import { GameState } from './common'

const tabNames = ['search', 'detail', 'setup'] as const
export type TabName = typeof tabNames[number]
export const TabName: Record<TabName, TabName> = {
  search: 'search',
  detail: 'detail',
  setup: 'setup',
} as const

export class AdvancedState {
  readonly tab: TabName = TabName.setup
  readonly tabs: TabName[] = [TabName.setup]
  readonly previewingGame: GameState | undefined
  readonly searchPlayerId: number | undefined
  readonly searchWithMoves: boolean = true

  constructor(init?: undefined | Partial<AdvancedState>) {
    if (init !== undefined) Object.assign(this, init)
  }

  private update(fields: Partial<AdvancedState>): AdvancedState {
    return new AdvancedState({ ...this, ...fields })
  }

  setTab(name: TabName): AdvancedState {
    return this.update({ tab: name })
  }

  setTabs(names: TabName[]): AdvancedState {
    return this.update({ tabs: names })
  }

  setTabIndex(index: number): AdvancedState {
    return this.update({ tab: this.tabs[index] })
  }

  get tabIndex(): number {
    return this.tabs.indexOf(this.tab)
  }

  setPreviewingGame(gameState: GameState): AdvancedState {
    return this.update({ previewingGame: gameState })
  }

  unsetPreviewingGame(): AdvancedState {
    return this.update({ previewingGame: undefined })
  }

  setSearchPlayerId(id: number): AdvancedState {
    return this.update({ searchPlayerId: id })
  }

  unsetSearchPlayerId(): AdvancedState {
    return this.update({ searchPlayerId: undefined })
  }

  setSearchWithMoves(on: boolean): AdvancedState {
    return this.update({ searchWithMoves: on })
  }
}

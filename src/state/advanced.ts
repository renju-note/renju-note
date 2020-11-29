import { Game } from '../rule'
import { GameState } from './game'

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
  readonly preview: GameState | undefined

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

  setPreview(game: Game, gameid?: number | undefined): AdvancedState {
    return this.update({ preview: new GameState({ main: game, cursor: game.size, gameid }) })
  }

  unsetPreview(): AdvancedState {
    return this.update({ preview: undefined })
  }
}
